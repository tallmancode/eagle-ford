import type { Payload } from 'payload'

import { aggregateFormSubmissionMetrics } from '@/lib/form-submissions/aggregateMetrics'
import { FORM_SUBMISSIONS_SITE_KEY } from '@/lib/form-submissions/siteKey'
import type {
  FormSubmissionMetricsSourceDoc,
  FormSubmissionsMetricsResponse,
} from '@/lib/form-submissions/types'

const PAGE_SIZE = 200

export async function queryFormSubmissionMetrics(
  payload: Payload,
  args: { from: Date; to: Date; fromIso: string; toIso: string },
): Promise<FormSubmissionsMetricsResponse> {
  const docs: FormSubmissionMetricsSourceDoc[] = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'form-submissions',
      depth: 1,
      limit: PAGE_SIZE,
      overrideAccess: true,
      page,
      select: {
        form: true,
        createdAt: true,
      },
      sort: 'createdAt',
      where: {
        and: [
          { createdAt: { greater_than_equal: args.fromIso } },
          { createdAt: { less_than_equal: args.toIso } },
        ],
      },
    })

    for (const doc of result.docs) {
      docs.push(doc as FormSubmissionMetricsSourceDoc)
    }

    hasNextPage = Boolean(result.hasNextPage)
    page += 1

    // Safety cap (~20k rows) to avoid unbounded loops on huge ranges.
    if (page > 100) break
  }

  return aggregateFormSubmissionMetrics(docs, {
    siteKey: FORM_SUBMISSIONS_SITE_KEY,
    fromIso: args.fromIso,
    toIso: args.toIso,
  })
}
