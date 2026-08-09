import type { ExportBeforeHook } from '@payloadcms/plugin-import-export/types'

export type FormSubmissionDataItem = {
  field: string
  value: string
}

type SubmissionUploadValue = {
  relationTo?: string
  value?: string | { id?: string; filename?: string | null; url?: string | null } | null
}

type SubmissionUploadGroup = {
  field: string
  value?: SubmissionUploadValue[] | null
}

export type FormSubmissionExportDoc = {
  id?: number | string
  form?: number | string | { id?: number | string; title?: string | null } | null
  submissionData?: FormSubmissionDataItem[] | null
  submissionUploads?: SubmissionUploadGroup[] | null
  createdAt?: string | null
  updatedAt?: string | null
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  email?: string | null
  [key: string]: unknown
}

const CONTACT_COLUMNS = ['firstName', 'lastName', 'phone', 'email'] as const

const SKIP_MERGE_KEYS = new Set(['submissionData', 'submissionUploads'])

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

function formatUploadMediaValue(
  item: SubmissionUploadValue | null | undefined,
): string | null {
  const media = item?.value
  if (media == null) return null
  if (typeof media === 'object') {
    if (typeof media.url === 'string' && media.url.trim()) return media.url
    if (typeof media.filename === 'string' && media.filename.trim()) return media.filename
    if (media.id != null) return String(media.id)
    return null
  }
  return String(media)
}

/** Turn upload groups into one readable string per form field (URLs or filenames). */
export function flattenSubmissionUploads(
  uploads: SubmissionUploadGroup[] | null | undefined,
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const group of uploads ?? []) {
    const field = group?.field?.trim()
    if (!field) continue

    const labels = (group.value ?? [])
      .map((item) => formatUploadMediaValue(item))
      .filter((label): label is string => Boolean(label))

    if (labels.length > 0) {
      result[field] = labels.join('; ')
    }
  }

  return result
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

function isNestedExportColumn(key: string, prefix: string): boolean {
  return key === prefix || key.startsWith(`${prefix}_`)
}

function stripNestedExportColumns(
  row: Record<string, unknown>,
  prefixes: string[],
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    if (prefixes.some((prefix) => isNestedExportColumn(key, prefix))) continue
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

function mergeRemainingScalars(
  result: Record<string, unknown>,
  sources: Array<Record<string, unknown> | null | undefined>,
): void {
  for (const source of sources) {
    if (!source) continue
    for (const [key, value] of Object.entries(source)) {
      if (key in result) continue
      if (SKIP_MERGE_KEYS.has(key)) continue
      if (value === null || value === undefined) {
        result[key] = null
        continue
      }
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        result[key] = value
      }
    }
  }
}

/**
 * Build a CSV-ready row with stable contact columns and no indexed submissionData paths.
 */
export function flattenFormSubmissionForCsv(
  row: Record<string, unknown>,
  original: FormSubmissionExportDoc | null | undefined,
): Record<string, unknown> {
  const answers = pivotSubmissionData(original?.submissionData)
  const uploads = flattenSubmissionUploads(original?.submissionUploads)
  const cleaned = stripNestedExportColumns(row, ['submissionData', 'submissionUploads'])
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
    if (key in uploads) continue
    result[key] = answers[key]
  }

  for (const [key, value] of Object.entries(uploads)) {
    result[key] = value
  }

  mergeRemainingScalars(result, [cleaned, original ?? undefined])

  return result
}

/**
 * Build a JSON export doc with `answers` and `uploads` instead of nested arrays.
 */
export function flattenFormSubmissionForJson(
  row: Record<string, unknown>,
  original: FormSubmissionExportDoc | null | undefined,
): Record<string, unknown> {
  const sourceAnswers =
    original?.submissionData ??
    (Array.isArray(row.submissionData) ? (row.submissionData as FormSubmissionDataItem[]) : null)
  const answers = pivotSubmissionData(sourceAnswers)
  const uploads = flattenSubmissionUploads(original?.submissionUploads)
  const cleaned = stripNestedExportColumns(row, ['submissionData', 'submissionUploads'])
  const formLabel = resolveFormExportLabel(original?.form) ?? cleaned.form ?? null

  const result: Record<string, unknown> = {
    ...cleaned,
    form: formLabel,
    answers,
  }

  if (Object.keys(uploads).length > 0) {
    result.uploads = uploads
  }

  for (const key of CONTACT_COLUMNS) {
    result[key] = contactValue(answers, original, key)
  }

  mergeRemainingScalars(result, [original ?? undefined])

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
