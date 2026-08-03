import type { SeverityLevel } from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'

import { scrubForSentry } from '@/lib/motor-city-leads/sentry'

export type StockFetchSentryContext = {
  event: 'stock_list_failure' | 'stock_vehicle_failure' | 'stock_filters_failure'
  dealerCode?: string
  httpStatus?: number
  errorCode?: string
  retryable?: boolean
  /** Safe host only — never full URL with secrets */
  apiHost?: string
  detail?: string
}

/** Process-local window for retryable stock failures (single Docker app container). */
export const RETRYABLE_STOCK_SENTRY_WINDOW_MS = 5 * 60 * 1000

const lastRetryableCaptureAt = new Map<string, number>()

export function safeApiHost(baseUrl: string | undefined): string | undefined {
  if (!baseUrl) return undefined
  try {
    return new URL(baseUrl).host
  } catch {
    return undefined
  }
}

function rateLimitKey(context: StockFetchSentryContext): string {
  return `${context.event}:${context.errorCode ?? 'unknown'}`
}

/**
 * Whether a retryable stock failure should emit a full Sentry event.
 * Exported for tests; process-local only (fingerprinting still groups across restarts).
 */
export function shouldCaptureRetryableStockEvent(
  context: StockFetchSentryContext,
  nowMs: number = Date.now(),
): boolean {
  if (!context.retryable) return true

  const key = rateLimitKey(context)
  const lastAt = lastRetryableCaptureAt.get(key)
  if (typeof lastAt === 'number' && nowMs - lastAt < RETRYABLE_STOCK_SENTRY_WINDOW_MS) {
    return false
  }

  lastRetryableCaptureAt.set(key, nowMs)
  return true
}

/** Test helper — clears the in-memory rate-limit map. */
export function resetStockSentryRateLimitState(): void {
  lastRetryableCaptureAt.clear()
}

/**
 * Sentry for Motor City stock HTTP failures. Never attach API keys or full request URLs with auth.
 * Retryable failures are rate-limited to one capture per event+errorCode every 5 minutes;
 * suppressed failures are recorded as breadcrumbs only.
 */
export function captureStockFetchEvent(error: unknown, context: StockFetchSentryContext): void {
  const level: SeverityLevel = context.retryable ? 'warning' : 'error'
  const fingerprint = ['motor-city-stock', context.event, context.errorCode ?? 'unknown']

  if (context.retryable && !shouldCaptureRetryableStockEvent(context)) {
    Sentry.addBreadcrumb({
      category: 'motor-city-stock',
      level: 'warning',
      message: context.detail || `Suppressed retryable stock failure: ${context.event}`,
      data: scrubForSentry({
        dealerCode: context.dealerCode,
        httpStatus: context.httpStatus,
        errorCode: context.errorCode,
        retryable: context.retryable,
        apiHost: context.apiHost,
      }) as Record<string, unknown>,
    })
    return
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level)
    scope.setFingerprint(fingerprint)
    scope.setTags({
      feature: 'motor-city-stock',
      stock_event: context.event,
      ...(context.errorCode ? { stock_error_code: context.errorCode } : {}),
      ...(context.dealerCode ? { dealer_code: context.dealerCode } : {}),
      ...(typeof context.retryable === 'boolean'
        ? { stock_retryable: String(context.retryable) }
        : {}),
    })
    scope.setContext(
      'motor_city_stock',
      scrubForSentry({
        dealerCode: context.dealerCode,
        httpStatus: context.httpStatus,
        errorCode: context.errorCode,
        retryable: context.retryable,
        apiHost: context.apiHost,
        detail: context.detail,
      }) as Record<string, unknown>,
    )

    if (error instanceof Error) {
      Sentry.captureException(error)
    } else {
      Sentry.captureMessage(context.detail || String(error), level)
    }
  })
}
