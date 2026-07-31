/**
 * Shared retry classification and backoff for Motor City stock + lead forwards.
 * Lead sweeper schedules retries via Payload jobs — avoid long sleeps in request handlers.
 */

export const DEFAULT_RETRY_BASE_DELAY_MS = 60_000
export const DEFAULT_RETRY_MAX_DELAY_MS = 60 * 60_000

/** Short in-request backoff for stock / immediate lead POST blips. */
export const IMMEDIATE_RETRY_BASE_DELAY_MS = 500
export const IMMEDIATE_RETRY_MAX_DELAY_MS = 4_000

export type RetryClassification = {
  retryable: boolean
  reason: string
}

/**
 * Classify an HTTP status for outbound retries.
 * Transient: 408, 429, 5xx. Permanent: auth/validation/other 4xx.
 */
export function classifyHttpStatus(status: number): RetryClassification {
  if (status === 408 || status === 429) {
    return { retryable: true, reason: `http_${status}` }
  }
  if (status >= 500 && status <= 599) {
    return { retryable: true, reason: `http_${status}` }
  }
  if (status === 401 || status === 403) {
    return { retryable: false, reason: 'auth' }
  }
  if (status >= 400 && status <= 499) {
    return { retryable: false, reason: `http_${status}` }
  }
  return { retryable: false, reason: `http_${status}` }
}

/**
 * Parse Retry-After as seconds or HTTP-date. Returns delay in ms, or null if absent/invalid.
 */
export function parseRetryAfterMs(
  header: string | null | undefined,
  nowMs: number = Date.now(),
): number | null {
  if (!header) return null
  const trimmed = header.trim()
  if (!trimmed) return null

  if (/^\d+$/.test(trimmed)) {
    const seconds = Number(trimmed)
    if (!Number.isFinite(seconds) || seconds < 0) return null
    return Math.min(seconds * 1000, DEFAULT_RETRY_MAX_DELAY_MS)
  }

  const dateMs = Date.parse(trimmed)
  if (Number.isNaN(dateMs)) return null
  const delay = dateMs - nowMs
  if (delay <= 0) return null
  return Math.min(delay, DEFAULT_RETRY_MAX_DELAY_MS)
}

export type BackoffOptions = {
  attempt: number
  baseDelayMs?: number
  maxDelayMs?: number
  /** Injected for tests; defaults to Math.random */
  random?: () => number
  /** Optional Retry-After override (ms) — used when larger than computed backoff */
  retryAfterMs?: number | null
}

/**
 * Bounded exponential backoff with full jitter.
 * attempt is 1-based (first failure → attempt 1).
 */
export function computeBackoffMs(options: BackoffOptions): number {
  const attempt = Math.max(1, Math.floor(options.attempt))
  const base = options.baseDelayMs ?? DEFAULT_RETRY_BASE_DELAY_MS
  const max = options.maxDelayMs ?? DEFAULT_RETRY_MAX_DELAY_MS
  const random = options.random ?? Math.random

  const exp = Math.min(max, base * 2 ** (attempt - 1))
  const jittered = Math.floor(exp * (0.5 + random() * 0.5))

  const retryAfter = options.retryAfterMs
  if (typeof retryAfter === 'number' && Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.min(max, Math.max(jittered, Math.floor(retryAfter)))
  }

  return Math.min(max, jittered)
}

export function computeNextRetryAt(options: BackoffOptions & { nowMs?: number }): string {
  const now = options.nowMs ?? Date.now()
  return new Date(now + computeBackoffMs(options)).toISOString()
}

export function isRetryDue(nextRetryAt: string | null | undefined, nowMs: number = Date.now()): boolean {
  if (!nextRetryAt) return true
  const ms = Date.parse(nextRetryAt)
  if (Number.isNaN(ms)) return true
  return ms <= nowMs
}

export function isAbortTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const name = 'name' in error ? String(error.name) : ''
  if (name === 'TimeoutError' || name === 'AbortError') return true
  const message = 'message' in error ? String(error.message) : ''
  return /aborted|timeout/i.test(message)
}
