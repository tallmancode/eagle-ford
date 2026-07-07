import type { CollectionBeforeChangeHook } from 'payload'
import { ValidationError } from 'payload'
import { validateMimeType } from 'payload/shared'

import {
  getUploadFieldsFromForm,
  type FormUploadField,
} from '@/lib/blocks/form-block/utils/getFormSteps'
import { FORM_UPLOAD_COLLECTIONS } from '@/plugins/form-builder/formInputBlocks'
import type { Form } from '@/payload-types'

function isUploadFieldWithName(field: {
  blockType?: string
  name?: string
}): field is FormUploadField {
  return field.blockType === 'upload' && Boolean(field.name)
}

/**
 * Plugin handleUploads only reads form.fields. Multi-step forms store fields in
 * form.steps[].fields — this hook processes those upload fields after the plugin hook.
 */
export const handleMultiStepFormUploads: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return data
  }

  const formID = data?.form
  const submissionData = data?.submissionData

  if (!formID || !submissionData) {
    return data
  }

  const { payload } = req
  const formSlug = 'forms'

  let form: Form
  try {
    form = (await payload.findByID({
      id: formID,
      collection: formSlug,
      req,
    })) as Form
  } catch {
    return data
  }

  const topLevelUploadNames = new Set(
    (form.fields ?? []).filter(isUploadFieldWithName).map((field) => field.name),
  )

  const alreadyProcessed = new Set(
    (data.submissionUploads ?? []).map((entry: { field: string }) => entry.field),
  )

  const uploadFields = getUploadFieldsFromForm(form).filter(
    (field) => !topLevelUploadNames.has(field.name) && !alreadyProcessed.has(field.name),
  )

  if (uploadFields.length === 0) {
    return data
  }

  const submissionDataArray = [...submissionData]
  const submissionMap = new Map<string, { index: number; value: unknown }>()

  for (let i = 0; i < submissionDataArray.length; i++) {
    const item = submissionDataArray[i]
    if (item) {
      submissionMap.set(item.field, { index: i, value: item.value })
    }
  }

  const requestFiles = req.files || {}
  const errors: { field: string; message: string }[] = []
  const uploadsByField = new Map<string, { relationTo: 'media'; value: string }[]>()
  const createdDocs: { id: string; collection: 'media' }[] = []

  for (const uploadField of uploadFields) {
    const { name, maxFileSize, mimeTypes, multiple, required, uploadCollection } = uploadField
    const fieldLabel = uploadField.label || name
    uploadsByField.set(name, [])

    if (!FORM_UPLOAD_COLLECTIONS.includes(uploadCollection)) {
      errors.push({
        field: name,
        message: `Upload collection "${uploadCollection}" is not configured in this plugin`,
      })
      continue
    }

    const rawFile = requestFiles[name]
    const requestFileList = rawFile ? (Array.isArray(rawFile) ? rawFile : [rawFile]) : []

    const existingSubmission = submissionMap.get(name)

    if (requestFileList.length > 0) {
      if (!multiple && requestFileList.length > 1) {
        errors.push({
          field: name,
          message: `${fieldLabel} does not allow multiple files`,
        })
        continue
      }

      for (const requestFile of requestFileList) {
        if (mimeTypes && mimeTypes.length > 0) {
          const allowedPatterns = mimeTypes.map((m) => m.mimeType)
          if (!validateMimeType(requestFile.mimetype, allowedPatterns)) {
            errors.push({
              field: name,
              message: `${fieldLabel}: File type "${requestFile.mimetype}" is not allowed. Allowed types: ${allowedPatterns.join(', ')}`,
            })
            continue
          }
        }

        if (maxFileSize && maxFileSize > 0 && requestFile.size > maxFileSize) {
          const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2)
          const fileSizeMB = (requestFile.size / (1024 * 1024)).toFixed(2)
          errors.push({
            field: name,
            message: `${fieldLabel}: File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
          })
          continue
        }

        try {
          const mediaDoc = await payload.create({
            collection: uploadCollection,
            data: {
              alt: requestFile.name,
            },
            file: {
              name: requestFile.name,
              data: requestFile.data,
              mimetype: requestFile.mimetype,
              size: requestFile.size,
            },
            req,
          })

          createdDocs.push({ id: String(mediaDoc.id), collection: uploadCollection })
          uploadsByField.get(name)!.push({
            relationTo: uploadCollection,
            value: String(mediaDoc.id),
          })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error'
          errors.push({
            field: name,
            message: `${fieldLabel}: Failed to upload file - ${errorMessage}`,
          })
        }
      }
    } else if (existingSubmission?.value) {
      const submittedValueStr = String(existingSubmission.value ?? '')
      if (!submittedValueStr) {
        if (required) {
          errors.push({ field: name, message: `${fieldLabel} is required` })
        }
        continue
      }

      if (!multiple && submittedValueStr.includes(',')) {
        errors.push({
          field: name,
          message: `${fieldLabel} does not allow multiple files`,
        })
        continue
      }

      const fileIds = multiple
        ? submittedValueStr
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        : [submittedValueStr]

      for (const fileId of fileIds) {
        try {
          const fileDoc = await payload.findByID({
            id: fileId,
            collection: uploadCollection,
            req,
          })

          if (mimeTypes && mimeTypes.length > 0) {
            const allowedPatterns = mimeTypes.map((m) => m.mimeType)
            const fileMimeType = fileDoc.mimeType
            if (fileMimeType && !validateMimeType(fileMimeType, allowedPatterns)) {
              errors.push({
                field: name,
                message: `${fieldLabel}: File type "${fileMimeType}" is not allowed. Allowed types: ${allowedPatterns.join(', ')}`,
              })
              continue
            }
          }

          if (maxFileSize && maxFileSize > 0) {
            const fileSize = fileDoc.filesize
            if (fileSize && fileSize > maxFileSize) {
              const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(2)
              const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2)
              errors.push({
                field: name,
                message: `${fieldLabel}: File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
              })
              continue
            }
          }

          uploadsByField.get(name)!.push({
            relationTo: uploadCollection,
            value: fileId,
          })
        } catch {
          errors.push({
            field: name,
            message: `${fieldLabel}: File with ID "${fileId}" not found`,
          })
        }
      }
    } else if (required) {
      errors.push({ field: name, message: `${fieldLabel} is required` })
    }
  }

  if (errors.length > 0) {
    for (const doc of createdDocs) {
      try {
        await payload.delete({ id: doc.id, collection: doc.collection, req })
      } catch {
        // best-effort cleanup
      }
    }

    throw new ValidationError({
      collection: 'form-submissions',
      errors: errors.map((error) => ({
        message: error.message,
        path: error.field,
      })),
    })
  }

  const uploadFieldNames = new Set(uploadFields.map((f) => f.name))
  const cleanedSubmissionData = submissionDataArray.filter(
    (item) => !uploadFieldNames.has(item.field),
  )

  const newUploads = Array.from(uploadsByField.entries())
    .filter(([, items]) => items.length > 0)
    .map(([field, value]) => ({ field, value }))

  const existingUploads = data.submissionUploads ?? []

  return {
    ...data,
    submissionData: cleanedSubmissionData,
    submissionUploads: [...existingUploads, ...newUploads],
  }
}
