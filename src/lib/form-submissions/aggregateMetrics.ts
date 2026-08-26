import { toUtcDayKey } from '@/lib/form-submissions/dateRange'
import type {
  FormMetricsByDay,
  FormMetricsByForm,
  FormSubmissionMetricsSourceDoc,
  FormSubmissionsMetricsResponse,
} from '@/lib/form-submissions/types'

function formIdOf(form: FormSubmissionMetricsSourceDoc['form']): string {
  if (form == null) return 'unknown'
  if (typeof form === 'object') {
    if (form.id != null) return String(form.id)
    return 'unknown'
  }
  return String(form)
}

function formTitleOf(form: FormSubmissionMetricsSourceDoc['form']): string {
  if (form == null) return 'Unknown form'
  if (typeof form === 'object') {
    if (typeof form.title === 'string' && form.title.trim()) return form.title.trim()
    if (form.id != null) return String(form.id)
    return 'Unknown form'
  }
  return String(form)
}

/** Pure aggregation used by the metrics API and unit tests. */
export function aggregateFormSubmissionMetrics(
  docs: FormSubmissionMetricsSourceDoc[],
  args: { siteKey: string; fromIso: string; toIso: string },
): FormSubmissionsMetricsResponse {
  const byFormMap = new Map<string, FormMetricsByForm>()
  const byDayMap = new Map<string, number>()

  for (const doc of docs) {
    const formId = formIdOf(doc.form)
    const formTitle = formTitleOf(doc.form)
    const existing = byFormMap.get(formId)
    if (existing) {
      existing.count += 1
    } else {
      byFormMap.set(formId, { formId, formTitle, count: 1 })
    }

    if (doc.createdAt) {
      const day = toUtcDayKey(doc.createdAt)
      if (day !== 'invalid') {
        byDayMap.set(day, (byDayMap.get(day) ?? 0) + 1)
      }
    }
  }

  const byForm = [...byFormMap.values()].sort((a, b) => b.count - a.count || a.formTitle.localeCompare(b.formTitle))
  const byDay: FormMetricsByDay[] = [...byDayMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    siteKey: args.siteKey,
    from: args.fromIso,
    to: args.toIso,
    total: docs.length,
    byForm,
    byDay,
  }
}
