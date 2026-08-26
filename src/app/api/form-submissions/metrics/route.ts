import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { isFormSubmissionsApiAuthorized } from '@/lib/form-submissions/apiAuth'
import { parseFormSubmissionsDateRange } from '@/lib/form-submissions/dateRange'
import { queryFormSubmissionMetrics } from '@/lib/form-submissions/queryMetrics'

export async function GET(request: Request) {
  if (!isFormSubmissionsApiAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const range = parseFormSubmissionsDateRange(url.searchParams)
  if ('error' in range) {
    return NextResponse.json({ error: range.error }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const metrics = await queryFormSubmissionMetrics(payload, range)
    return NextResponse.json(metrics)
  } catch {
    return NextResponse.json({ error: 'Failed to load form submission metrics' }, { status: 500 })
  }
}
