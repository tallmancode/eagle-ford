import {
  classifyHttpStatus,
  computeBackoffMs,
  IMMEDIATE_RETRY_BASE_DELAY_MS,
  IMMEDIATE_RETRY_MAX_DELAY_MS,
  isAbortTimeoutError,
  parseRetryAfterMs,
} from '@/lib/http/retryPolicy'
import {
  LEAD_IMMEDIATE_MAX_ATTEMPTS,
  LEAD_POST_TIMEOUT_MS,
} from '@/lib/motor-city-leads/constants'
import type { MotorCitySiteFormLeadRequest } from '@/lib/motor-city-leads/types'
import { MotorCityLeadsError } from '@/lib/motor-city-leads/types'

function getMotorCityConfig() {
  const baseUrl = process.env.MOTOR_CITY_STOCK_API_URL
  const apiKey = process.env.MOTOR_CITY_STOCK_API_KEY

  if (!baseUrl) {
    throw new MotorCityLeadsError('MOTOR_CITY_STOCK_API_URL is not configured', {
      code: 'MISSING_URL',
      retryable: false,
    })
  }

  if (!apiKey) {
    throw new MotorCityLeadsError('MOTOR_CITY_STOCK_API_KEY is not configured', {
      code: 'MISSING_KEY',
      retryable: false,
    })
  }

  return { baseUrl, apiKey }
}

export type SubmitSiteFormLeadResult = {
  ok: true
  id: string
  status: string
  created: boolean
  lmsLeadReference?: string | null
}

export type SubmitSiteFormLeadOptions = {
  /** Immediate attempts with short backoff (default 3). */
  maxAttempts?: number
  timeoutMs?: number
  fetchImpl?: typeof fetch
  sleep?: (ms: number) => Promise<void>
  random?: () => number
}

async function defaultSleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function postOnce(
  body: MotorCitySiteFormLeadRequest,
  options: {
    baseUrl: string
    apiKey: string
    timeoutMs: number
    fetchImpl: typeof fetch
  },
): Promise<SubmitSiteFormLeadResult> {
  const url = new URL('/api/leads/site-forms', options.baseUrl)

  let response: Response
  try {
    response = await options.fetchImpl(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `stock-api-clients API-Key ${options.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(options.timeoutMs),
      cache: 'no-store',
    })
  } catch (error) {
    const timedOut = isAbortTimeoutError(error)
    throw new MotorCityLeadsError(
      timedOut
        ? 'Timed out reaching Eagle Motor City lead API'
        : 'Failed to reach Eagle Motor City lead API',
      {
        code: timedOut ? 'TIMEOUT' : 'NETWORK',
        retryable: true,
        cause: error,
      },
    )
  }

  const json = (await response.json().catch(() => null)) as {
    ok?: boolean
    id?: string
    status?: string
    created?: boolean
    lmsLeadReference?: string | null
    error?: string
    code?: string
  } | null

  if (!response.ok) {
    const { retryable, reason } = classifyHttpStatus(response.status)
    const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'))
    throw new MotorCityLeadsError(json?.error || `Motor City lead API HTTP ${response.status}`, {
      code: json?.code || reason.toUpperCase(),
      status: response.status,
      retryable,
      retryAfterMs: retryAfterMs ?? undefined,
    })
  }

  if (!json?.id) {
    throw new MotorCityLeadsError('Motor City lead API returned an unexpected body', {
      code: 'BAD_BODY',
      retryable: true,
    })
  }

  return {
    ok: true,
    id: json.id,
    status: json.status ?? 'queued',
    created: Boolean(json.created),
    lmsLeadReference: json.lmsLeadReference ?? null,
  }
}

/**
 * POSTs a normalized lead to Eagle Motor City for CMS LMS injection.
 * Uses the same stock-api-clients API key as the stock integration.
 * Bounded immediate retries for transient failures; durable retries are handled by the sweeper.
 * Idempotency: `extLeadRef` (form-submission id) is stable across retries.
 */
export async function submitSiteFormLead(
  body: MotorCitySiteFormLeadRequest,
  options: SubmitSiteFormLeadOptions = {},
): Promise<SubmitSiteFormLeadResult> {
  const { baseUrl, apiKey } = getMotorCityConfig()
  const maxAttempts = options.maxAttempts ?? LEAD_IMMEDIATE_MAX_ATTEMPTS
  const timeoutMs = options.timeoutMs ?? LEAD_POST_TIMEOUT_MS
  const fetchImpl = options.fetchImpl ?? fetch
  const sleep = options.sleep ?? defaultSleep
  const random = options.random ?? Math.random

  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await postOnce(body, { baseUrl, apiKey, timeoutMs, fetchImpl })
    } catch (error) {
      lastError = error
      const retryable = error instanceof MotorCityLeadsError ? error.retryable : true
      if (!retryable || attempt >= maxAttempts) {
        throw error
      }

      const retryAfterMs =
        error instanceof MotorCityLeadsError ? error.retryAfterMs : undefined

      await sleep(
        computeBackoffMs({
          attempt,
          baseDelayMs: IMMEDIATE_RETRY_BASE_DELAY_MS,
          maxDelayMs: IMMEDIATE_RETRY_MAX_DELAY_MS,
          retryAfterMs,
          random,
        }),
      )
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new MotorCityLeadsError('Failed to submit lead to Eagle Motor City', {
        code: 'NETWORK',
        retryable: true,
      })
}
