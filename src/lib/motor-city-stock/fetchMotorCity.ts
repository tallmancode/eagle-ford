import {
  classifyHttpStatus,
  computeBackoffMs,
  IMMEDIATE_RETRY_BASE_DELAY_MS,
  IMMEDIATE_RETRY_MAX_DELAY_MS,
  isAbortTimeoutError,
  parseRetryAfterMs,
} from '@/lib/http/retryPolicy'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'

export const STOCK_FETCH_TIMEOUT_MS = 15_000
export const STOCK_FETCH_MAX_ATTEMPTS = 3

export type MotorCityFetchOptions = {
  url: URL
  apiKey: string
  /** next.js fetch cache hint — preserved on success path */
  next?: { revalidate?: number | false; tags?: string[] }
  timeoutMs?: number
  maxAttempts?: number
  fetchImpl?: typeof fetch
  sleep?: (ms: number) => Promise<void>
  random?: () => number
}

async function defaultSleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Authenticated GET to Motor City with timeout, Retry-After respect, and bounded retries.
 * Callers attach `next: { revalidate }` so successful responses still participate in Next caching.
 */
export async function fetchMotorCityJson<T>(options: MotorCityFetchOptions): Promise<T> {
  const {
    url,
    apiKey,
    next,
    timeoutMs = STOCK_FETCH_TIMEOUT_MS,
    maxAttempts = STOCK_FETCH_MAX_ATTEMPTS,
    fetchImpl = fetch,
    sleep = defaultSleep,
    random = Math.random,
  } = options

  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetchImpl(url, {
        headers: {
          Authorization: `stock-api-clients API-Key ${apiKey}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(timeoutMs),
        ...(next ? { next } : {}),
      })

      if (!response.ok) {
        let message = `Stock API request failed with status ${response.status}`
        try {
          const body = (await response.json()) as { error?: string }
          if (body.error) message = body.error
        } catch {
          // ignore JSON parse errors
        }

        const { retryable, reason } = classifyHttpStatus(response.status)
        const error = new MotorCityStockError(message, response.status, {
          code: reason.toUpperCase(),
          retryable,
        })

        if (!retryable || attempt >= maxAttempts) {
          throw error
        }

        const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'))
        await sleep(
          computeBackoffMs({
            attempt,
            baseDelayMs: IMMEDIATE_RETRY_BASE_DELAY_MS,
            maxDelayMs: IMMEDIATE_RETRY_MAX_DELAY_MS,
            retryAfterMs,
            random,
          }),
        )
        lastError = error
        continue
      }

      return (await response.json()) as T
    } catch (error) {
      if (error instanceof MotorCityStockError && !error.retryable) {
        throw error
      }

      lastError = error
      if (attempt >= maxAttempts) {
        if (error instanceof MotorCityStockError) throw error
        const timedOut = isAbortTimeoutError(error)
        throw new MotorCityStockError(
          timedOut ? 'Stock API request timed out' : 'Stock API request failed',
          timedOut ? 408 : 503,
          {
            code: timedOut ? 'TIMEOUT' : 'NETWORK',
            retryable: true,
            cause: error,
          },
        )
      }

      await sleep(
        computeBackoffMs({
          attempt,
          baseDelayMs: IMMEDIATE_RETRY_BASE_DELAY_MS,
          maxDelayMs: IMMEDIATE_RETRY_MAX_DELAY_MS,
          random,
        }),
      )
    }
  }

  throw lastError instanceof MotorCityStockError
    ? lastError
    : new MotorCityStockError('Stock API request failed', 503, {
        code: 'NETWORK',
        retryable: true,
      })
}
