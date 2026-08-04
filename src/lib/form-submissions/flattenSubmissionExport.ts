import type { ExportBeforeHook } from '@payloadcms/plugin-import-export/types'

import type { FormSubmissionDataItem } from '@/lib/motor-city-leads/types'

const CONTACT_COLUMNS = ['firstName', 'lastName', 'phone', 'email'] as const

const MOTOR_CITY_COLUMNS = [
  'motorCityLeadId',
  'motorCityLeadStatus',
  'motorCityLeadError',
  'motorCityLeadAttempts',
  'motorCityLeadNextRetryAt',
  'motorCityLeadRetryable',
] as const

export type FormSubmissionExportDoc = {
  id?: number | string
  form?: number | string | { id?: number | string; title?: string | null } | null
  submissionData?: FormSubmissionDataItem[] | null
  createdAt?: string | null
  updatedAt?: string | null
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  email?: string | null
  motorCityLeadId?: string | null
  motorCityLeadStatus?: string | null
  motorCityLeadError?: string | null
  motorCityLeadAttempts?: number | null
  motorCityLeadNextRetryAt?: string | null
  motorCityLeadRetryable?: boolean | null
  [key: string]: unknown
}

/** Pivot `{ field, value }[]` into a keyed map preserving first-seen order. */
export function pivotSubmissionData(
  items: FormSubmissionDataItem[] | null | undefined,
): Record<string, string> {
  const answers: Record<string, string> = {}
  for (const item of items ?? []) {
    const field = item?.field?.trim()
    if (!field || field in answers) continue
    answers[field] = item.value ?? ''
  }
  return answers
}

export function resolveFormExportLabel(
  form: FormSubmissionExportDoc['form'],
): number | string | null {
  if (form == null) return null
  if (typeof form === 'object') {
    if (typeof form.title === 'string' && form.title.trim()) return form.title
    if (form.id != null) return form.id
    return null
  }
  return form
}

function isSubmissionDataColumn(key: string): boolean {
  return key === 'submissionData' || key.startsWith('submissionData_')
}

function stripSubmissionDataColumns(row: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    if (isSubmissionDataColumn(key)) continue
    cleaned[key] = value
  }
  return cleaned
}

function contactValue(
  answers: Record<string, string>,
  original: FormSubmissionExportDoc | null | undefined,
  key: (typeof CONTACT_COLUMNS)[number],
): string | null {
  if (key in answers) return answers[key] ?? null
  const stored = original?.[key]
  return typeof stored === 'string' && stored.length > 0 ? stored : null
}

/**
 * Build a CSV-ready row with stable contact columns and no indexed submissionData paths.
 */
export function flattenFormSubmissionForCsv(
  row: Record<string, unknown>,
  original: FormSubmissionExportDoc | null | undefined,
): Record<string, unknown> {
  const answers = pivotSubmissionData(original?.submissionData)
  const cleaned = stripSubmissionDataColumns(row)
  const formLabel = resolveFormExportLabel(original?.form) ?? cleaned.form ?? null

  const result: Record<string, unknown> = {}

  result.id = cleaned.id ?? original?.id ?? null
  result.form = formLabel
  result.createdAt = cleaned.createdAt ?? original?.createdAt ?? null
  result.updatedAt = cleaned.updatedAt ?? original?.updatedAt ?? null

  for (const key of CONTACT_COLUMNS) {
    result[key] = contactValue(answers, original, key)
  }

  for (const key of Object.keys(answers)) {
    if ((CONTACT_COLUMNS as readonly string[]).includes(key)) continue
    result[key] = answers[key]
  }

  for (const key of MOTOR_CITY_COLUMNS) {
    if (key in cleaned) {
      result[key] = cleaned[key]
    } else if (original && key in original) {
      result[key] = original[key] ?? null
    }
  }

  for (const [key, value] of Object.entries(cleaned)) {
    if (key in result) continue
    if (key === 'id' || key === 'form' || key === 'createdAt' || key === 'updatedAt') continue
    result[key] = value
  }

  return result
}

/**
 * Build a JSON export doc with `answers` instead of a submissionData array.
 */
export function flattenFormSubmissionForJson(
  row: Record<string, unknown>,
  original: FormSubmissionExportDoc | null | undefined,
): Record<string, unknown> {
  const sourceAnswers =
    original?.submissionData ??
    (Array.isArray(row.submissionData) ? (row.submissionData as FormSubmissionDataItem[]) : null)
  const answers = pivotSubmissionData(sourceAnswers)
  const { submissionData: _removed, ...rest } = row
  const formLabel = resolveFormExportLabel(original?.form) ?? rest.form ?? null

  const result: Record<string, unknown> = {
    ...rest,
    form: formLabel,
    answers,
  }

  for (const key of CONTACT_COLUMNS) {
    result[key] = contactValue(answers, original, key)
  }

  return result
}

async function loadFullSubmissionDocs(
  originalData: FormSubmissionExportDoc[],
  req: Parameters<ExportBeforeHook>[0]['req'],
): Promise<Map<string, FormSubmissionExportDoc>> {
  const fullById = new Map<string, FormSubmissionExportDoc>()
  const ids = originalData.map((doc) => doc?.id).filter((id): id is number | string => id != null)

  if (ids.length === 0 || !req?.payload) {
    return fullById
  }

  const result = await req.payload.find({
    collection: 'form-submissions',
    depth: 1,
    limit: ids.length,
    overrideAccess: false,
    pagination: false,
    req,
    where: {
      id: {
        in: ids,
      },
    },
  })

  for (const doc of result.docs) {
    fullById.set(String(doc.id), doc as unknown as FormSubmissionExportDoc)
  }

  return fullById
}

/**
 * Collection export before-hook: always pivot answers from full submission docs so
 * Fields-select (which may omit submissionData) still yields name/phone columns.
 */
export const flattenFormSubmissionExportBatch: ExportBeforeHook = async ({
  data,
  format,
  originalData,
  req,
}) => {
  const typedOriginals = originalData as FormSubmissionExportDoc[]
  let fullById = new Map<string, FormSubmissionExportDoc>()

  try {
    fullById = await loadFullSubmissionDocs(typedOriginals, req)
  } catch {
    fullById = new Map()
  }

  return data.map((row, index) => {
    const original = typedOriginals[index] ?? null
    const full =
      (original?.id != null ? fullById.get(String(original.id)) : undefined) ?? original

    if (format === 'csv') {
      return flattenFormSubmissionForCsv(row, full)
    }
    return flattenFormSubmissionForJson(row, full)
  })
}
