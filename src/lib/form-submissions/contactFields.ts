import type { CollectionBeforeChangeHook, Field } from 'payload'

import { pivotSubmissionData } from '@/lib/form-submissions/flattenSubmissionExport'
import type { FormSubmissionDataItem } from '@/lib/motor-city-leads/types'

export const FORM_SUBMISSION_CONTACT_FIELDS = [
  'firstName',
  'lastName',
  'phone',
  'email',
] as const

export type FormSubmissionContactField = (typeof FORM_SUBMISSION_CONTACT_FIELDS)[number]

/** Read-only contact columns for list view + export field picker. */
export function getFormSubmissionContactFields(): Field[] {
  return [
    {
      name: 'firstName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Copied from the form answer named firstName',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Copied from the form answer named lastName',
      },
    },
    {
      name: 'phone',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Copied from the form answer named phone',
      },
    },
    {
      name: 'email',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Copied from the form answer named email',
      },
    },
  ]
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
