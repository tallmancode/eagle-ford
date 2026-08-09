import type { CollectionBeforeChangeHook, Field } from 'payload'

import {
  pivotSubmissionData,
  type FormSubmissionDataItem,
} from '@/lib/form-submissions/flattenSubmissionExport'

export const FORM_SUBMISSION_CONTACT_FIELDS = [
  'firstName',
  'lastName',
  'phone',
  'email',
] as const

/** Shared Form Submissions list columns across all Eagle sites. */
export const FORM_SUBMISSION_LIST_COLUMNS = [
  'form',
  'firstName',
  'lastName',
  'phone',
  'email',
  'createdAt',
] as const

export const formSubmissionListAdmin = {
  defaultColumns: [...FORM_SUBMISSION_LIST_COLUMNS],
  useAsTitle: 'form' as const,
}

export type FormSubmissionContactField = (typeof FORM_SUBMISSION_CONTACT_FIELDS)[number]

function readContactAnswer(
  fieldName: FormSubmissionContactField,
  siblingData: Record<string, unknown> | undefined,
  storedValue: unknown,
): string {
  if (typeof storedValue === 'string' && storedValue.trim()) {
    return storedValue
  }

  const answers = pivotSubmissionData(
    siblingData?.submissionData as FormSubmissionDataItem[] | null | undefined,
  )

  return answers[fieldName] ?? ''
}

/** Hide nested submission arrays from the export field picker (flatten hook handles CSV). */
export function withFormSubmissionExportFieldTweaks(defaultFields: Field[]): Field[] {
  return defaultFields.map((field) => {
    if (!('name' in field)) return field
    if (field.name === 'submissionData' || field.name === 'submissionUploads') {
      return {
        ...field,
        custom: {
          ...('custom' in field && field.custom && typeof field.custom === 'object'
            ? field.custom
            : {}),
          'plugin-import-export': {
            disabled: true,
          },
        },
      }
    }
    return field
  })
}

/** Read-only contact columns for list view + export field picker. */
export function getFormSubmissionContactFields(): Field[] {
  return FORM_SUBMISSION_CONTACT_FIELDS.map((fieldName) => ({
    name: fieldName,
    type: 'text' as const,
    admin: {
      readOnly: true,
      description: `Copied from the form answer named ${fieldName}`,
    },
    hooks: {
      afterRead: [
        ({ siblingData, value }) =>
          readContactAnswer(fieldName, siblingData as Record<string, unknown> | undefined, value),
      ],
    },
  }))
}

export function applyContactFieldsFromSubmissionData(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const answers = pivotSubmissionData(
    data.submissionData as FormSubmissionDataItem[] | null | undefined,
  )

  for (const key of FORM_SUBMISSION_CONTACT_FIELDS) {
    if (key in answers) {
      data[key] = answers[key]
    }
  }

  return data
}

/** Persist contact columns from submissionData so export Fields can select them. */
export const denormalizeSubmissionContactFields: CollectionBeforeChangeHook = ({ data }) => {
  if (!data || typeof data !== 'object') return data
  return applyContactFieldsFromSubmissionData(data as Record<string, unknown>)
}
