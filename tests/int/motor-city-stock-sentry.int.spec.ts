import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  captureStockFetchEvent,
  resetStockSentryRateLimitState,
  RETRYABLE_STOCK_SENTRY_WINDOW_MS,
  shouldCaptureRetryableStockEvent,
} from '@/lib/motor-city-stock/sentry'

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
  withScope: vi.fn((callback: (scope: { setLevel: () => void; setFingerprint: () => void; setTags: () => void; setContext: () => void }) => void) => {
    callback({
      setLevel: vi.fn(),
      setFingerprint: vi.fn(),
      setTags: vi.fn(),
      setContext: vi.fn(),
    })
  }),
}))

describe('motor-city-stock sentry rate limit', () => {
  beforeEach(() => {
    resetStockSentryRateLimitState()
    vi.clearAllMocks()
  })

  afterEach(() => {
    resetStockSentryRateLimitState()
  })

  it('allows non-retryable failures always', () => {
    const context = {
      event: 'stock_vehicle_failure' as const,
      errorCode: 'HTTP_400',
      retryable: false,
    }

    expect(shouldCaptureRetryableStockEvent(context, 1_000)).toBe(true)
    expect(shouldCaptureRetryableStockEvent(context, 1_001)).toBe(true)
  })

  it('rate-limits retryable failures within the window', () => {
    const context = {
      event: 'stock_vehicle_failure' as const,
      errorCode: 'HTTP_502',
      retryable: true,
    }

    const t0 = 1_000_000
    expect(shouldCaptureRetryableStockEvent(context, t0)).toBe(true)
    expect(shouldCaptureRetryableStockEvent(context, t0 + 60_000)).toBe(false)
    expect(
      shouldCaptureRetryableStockEvent(context, t0 + RETRYABLE_STOCK_SENTRY_WINDOW_MS),
    ).toBe(true)
  })

  it('uses separate keys per event and error code', () => {
    const t0 = 2_000_000
    expect(
      shouldCaptureRetryableStockEvent(
        { event: 'stock_vehicle_failure', errorCode: 'HTTP_502', retryable: true },
        t0,
      ),
    ).toBe(true)
    expect(
      shouldCaptureRetryableStockEvent(
        { event: 'stock_list_failure', errorCode: 'HTTP_502', retryable: true },
        t0 + 1,
      ),
    ).toBe(true)
    expect(
      shouldCaptureRetryableStockEvent(
        { event: 'stock_vehicle_failure', errorCode: 'HTTP_503', retryable: true },
        t0 + 2,
      ),
    ).toBe(true)
  })

  it('adds a breadcrumb instead of capturing when rate-limited', async () => {
    const Sentry = await import('@sentry/nextjs')
    const error = new Error('Stock API request failed with status 502')
    const context = {
      event: 'stock_vehicle_failure' as const,
      errorCode: 'HTTP_502',
      retryable: true,
      detail: 'Failed after retries',
    }

    captureStockFetchEvent(error, context)
    captureStockFetchEvent(error, context)

    expect(Sentry.captureException).toHaveBeenCalledTimes(1)
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(1)
  })
})
