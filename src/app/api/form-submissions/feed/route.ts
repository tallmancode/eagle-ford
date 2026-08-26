import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { isFormSubmissionsApiAuthorized } from '@/lib/form-submissions/apiAuth'
import {
  parseFeedPagination,
  parseFormSubmissionsDateRange,
} from '@/lib/form-submissions/dateRange'
import { queryFormSubmissionFeed } from '@/lib/form-submissions/queryFeed'

export async function GET(request: Request) {
  if (!isFormSubmissionsApiAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const range = parseFormSubmissionsDateRange(url.searchParams)
  if ('error' in range) {
    return NextResponse.json({ error: range.error }, { status: 400 })
  }

  const { page, limit } = parseFeedPagination(url.searchParams)

  try {
    const payload = await getPayload({ config })
    const feed = await queryFormSubmissionFeed(payload, {
      fromIso: range.fromIso,
      toIso: range.toIso,
      page,
      limit,
    })
    return NextResponse.json(feed)
  } catch {
    return NextResponse.json({ error: 'Failed to load form submission feed' }, { status: 500 })
  }
}
