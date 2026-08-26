const DEFAULT_RANGE_DAYS = 30
const MAX_RANGE_DAYS = 366

export type ParsedDateRange = {
  from: Date
  to: Date
  fromIso: string
  toIso: string
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function endOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999),
  )
}

function parseIsoDate(value: string | null): Date | null {
  if (!value?.trim()) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

/** Parse `from` / `to` query params; default last 30 UTC days inclusive. */
export function parseFormSubmissionsDateRange(
  searchParams: URLSearchParams,
  now: Date = new Date(),
): ParsedDateRange | { error: string } {
  const rawFrom = parseIsoDate(searchParams.get('from'))
  const rawTo = parseIsoDate(searchParams.get('to'))

  const to = endOfUtcDay(rawTo ?? now)
  const fromDefault = new Date(to)
  fromDefault.setUTCDate(fromDefault.getUTCDate() - (DEFAULT_RANGE_DAYS - 1))
  const from = startOfUtcDay(rawFrom ?? fromDefault)

  if (from.getTime() > to.getTime()) {
    return { error: '`from` must be on or before `to`' }
  }

  const spanMs = to.getTime() - from.getTime()
  const maxMs = MAX_RANGE_DAYS * 24 * 60 * 60 * 1000
  if (spanMs > maxMs) {
    return { error: `Date range must be at most ${MAX_RANGE_DAYS} days` }
  }

  return {
    from,
    to,
    fromIso: from.toISOString(),
    toIso: to.toISOString(),
  }
}

export function parseFeedPagination(searchParams: URLSearchParams): {
  page: number
  limit: number
} {
  const pageRaw = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const limitRaw = Number.parseInt(searchParams.get('limit') ?? '20', 10)
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1
  const limit = Number.isFinite(limitRaw) ? Math.min(50, Math.max(1, limitRaw)) : 20
  return { page, limit }
}

/** UTC calendar day key YYYY-MM-DD. */
export function toUtcDayKey(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'invalid'
  return d.toISOString().slice(0, 10)
}
