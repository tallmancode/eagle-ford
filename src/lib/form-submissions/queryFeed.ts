import type { Payload } from 'payload'

import { FORM_SUBMISSIONS_SITE_KEY } from '@/lib/form-submissions/siteKey'
import type {
  FormSubmissionFeedDoc,
  FormSubmissionMetricsSourceDoc,
  FormSubmissionsFeedResponse,
} from '@/lib/form-submissions/types'

function stringOrNull(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value
  return null
}

function mapFeedDoc(doc: FormSubmissionMetricsSourceDoc & { id: string | number }): FormSubmissionFeedDoc {
  const form = doc.form
  let formId: string | null = null
  let formTitle: string | null = null

  if (form != null) {
    if (typeof form === 'object') {
      formId = form.id != null ? String(form.id) : null
      formTitle =
        typeof form.title === 'string' && form.title.trim() ? form.title.trim() : formId
    } else {
      formId = String(form)
      formTitle = formId
    }
  }

  return {
    id: String(doc.id),
    formId,
    formTitle,
    firstName: stringOrNull(doc.firstName),
    lastName: stringOrNull(doc.lastName),
    phone: stringOrNull(doc.phone),
    email: stringOrNull(doc.email),
    createdAt: typeof doc.createdAt === 'string' ? doc.createdAt : new Date(0).toISOString(),
  }
}

export async function queryFormSubmissionFeed(
  payload: Payload,
  args: { fromIso: string; toIso: string; page: number; limit: number },
): Promise<FormSubmissionsFeedResponse> {
  const result = await payload.find({
    collection: 'form-submissions',
    depth: 1,
    limit: args.limit,
    overrideAccess: true,
    page: args.page,
    select: {
      form: true,
      firstName: true,
      lastName: true,
      phone: true,
      email: true,
      createdAt: true,
    },
    sort: '-createdAt',
    where: {
      and: [
        { createdAt: { greater_than_equal: args.fromIso } },
        { createdAt: { less_than_equal: args.toIso } },
      ],
    },
  })

  return {
    siteKey: FORM_SUBMISSIONS_SITE_KEY,
    docs: result.docs.map((doc) =>
      mapFeedDoc(doc as FormSubmissionMetricsSourceDoc & { id: string | number }),
    ),
    totalDocs: result.totalDocs,
    page: result.page ?? args.page,
    limit: result.limit ?? args.limit,
    hasNextPage: Boolean(result.hasNextPage),
  }
}
