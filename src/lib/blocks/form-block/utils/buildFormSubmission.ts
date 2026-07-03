import type { Form } from '@/payload-types'

import { getUploadFieldsFromForm } from '@/lib/blocks/form-block/utils/getFormSteps'
import { normalizeUploadValue } from '@/lib/blocks/form-block/utils/uploadFieldUtils'

type SubmissionDataItem = {
  field: string
  value: string
}

export function formHasUploadFields(form: Form): boolean {
  return getUploadFieldsFromForm(form).length > 0
}

export function buildFormSubmissionRequest(
  formId: string,
  form: Form,
  data: Record<string, unknown>,
): { body: BodyInit; headers?: HeadersInit } {
  const uploadFields = getUploadFieldsFromForm(form)
  const uploadFieldNames = new Set(uploadFields.map((f) => f.name))

  const submissionData: SubmissionDataItem[] = []

  for (const [fieldName, value] of Object.entries(data)) {
    if (uploadFieldNames.has(fieldName)) {
      continue
    }

    submissionData.push({
      field: fieldName,
      value: String(value ?? ''),
    })
  }

  const hasUploads = uploadFieldNames.size > 0

  if (!hasUploads) {
    return {
      body: JSON.stringify({
        form: formId,
        submissionData,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  const formData = new FormData()
  formData.append(
    '_payload',
    JSON.stringify({
      form: formId,
      submissionData,
    }),
  )

  for (const field of uploadFields) {
    const files = normalizeUploadValue(data[field.name])
    for (const file of files) {
      formData.append(field.name, file)
    }
  }

  return { body: formData }
}
