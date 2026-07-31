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

export function safeApiHost(baseUrl: string | undefined): string | undefined {
  if (!baseUrl) return undefined
  try {
    return new URL(baseUrl).host
  } catch {
    return undefined
  }
}

/**
 * Sentry for Motor City stock HTTP failures. Never attach API keys or full request URLs with auth.
 */
export function captureStockFetchEvent(error: unknown, context: StockFetchSentryContext): void {
  const level: SeverityLevel = context.retryable ? 'warning' : 'error'
  const fingerprint = ['motor-city-stock', context.event, context.errorCode ?? 'unknown']

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
