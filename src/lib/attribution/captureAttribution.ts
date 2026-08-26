export type LeadAttribution = {
  gclid?: string
  gbraid?: string
  wbraid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  landing_page?: string
  referrer?: string
  capturedAt?: string
}

export const ATTRIBUTION_STORAGE_KEY = 'eagle-ford:attribution'
export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000

const QUERY_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

type QueryKey = (typeof QUERY_KEYS)[number]

function asTrimmed(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function isExpired(capturedAt: string | undefined, now = Date.now()): boolean {
  if (!capturedAt) return true
  const ts = Date.parse(capturedAt)
  if (Number.isNaN(ts)) return true
  return now - ts > ATTRIBUTION_TTL_MS
}

export function readStoredAttribution(now = Date.now()): LeadAttribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LeadAttribution
    if (!parsed || typeof parsed !== 'object') return null
    if (isExpired(parsed.capturedAt, now)) {
      localStorage.removeItem(ATTRIBUTION_STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeStoredAttribution(value: LeadAttribution): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Ignore storage failures.
  }
}

function pickQueryParams(search: string): Partial<Record<QueryKey, string>> {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const out: Partial<Record<QueryKey, string>> = {}
  for (const key of QUERY_KEYS) {
    const value = asTrimmed(params.get(key) ?? '')
    if (value) out[key] = value
  }
  return out
}

function hasClickOrUtm(data: Partial<LeadAttribution>): boolean {
  return QUERY_KEYS.some((key) => Boolean(asTrimmed(data[key])))
}

/**
 * First-touch attribution within a 90-day window.
 * New gclid/UTMs on a later landing do not overwrite an existing click id
 * still inside the TTL; empty landings keep the stored record.
 */
export function captureAttribution(args?: {
  search?: string
  pathname?: string
  referrer?: string
  now?: number
}): LeadAttribution | null {
  const now = args?.now ?? Date.now()
  const search = args?.search ?? (typeof window !== 'undefined' ? window.location.search : '')
  const pathname =
    args?.pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
  const referrer =
    args?.referrer ?? (typeof document !== 'undefined' ? document.referrer || '' : '')

  const incoming = pickQueryParams(search)
  const existing = readStoredAttribution(now)

  if (!hasClickOrUtm(incoming)) {
    return existing
  }

  if (existing?.gclid && !incoming.gclid) {
    return existing
  }

  if (existing?.gclid && incoming.gclid && existing.gclid === incoming.gclid) {
    return existing
  }

  // First-touch: keep existing gclid if still valid and a different click arrives later.
  if (existing?.gclid && incoming.gclid && existing.gclid !== incoming.gclid) {
    return existing
  }

  const next: LeadAttribution = {
    ...existing,
    ...incoming,
    landing_page: existing?.landing_page || pathname || '/',
    referrer: existing?.referrer || asTrimmed(referrer) || undefined,
    capturedAt: existing?.capturedAt || new Date(now).toISOString(),
  }

  writeStoredAttribution(next)
  return next
}

export function getAttributionForSubmit(): LeadAttribution | null {
  return captureAttribution()
}

export function compactAttribution(
  value: LeadAttribution | null | undefined,
): LeadAttribution | undefined {
  if (!value) return undefined
  const out: LeadAttribution = {}
  for (const key of [
    ...QUERY_KEYS,
    'landing_page',
    'referrer',
    'capturedAt',
  ] as const) {
    const trimmed = asTrimmed(value[key])
    if (trimmed) out[key] = trimmed
  }
  return Object.keys(out).length ? out : undefined
}
