import { describe, expect, it } from 'vitest'

import {
  classifyHttpStatus,
  computeBackoffMs,
  computeNextRetryAt,
  isAbortTimeoutError,
  isRetryDue,
  parseRetryAfterMs,
} from '@/lib/http/retryPolicy'

describe('retryPolicy', () => {
  it('treats 429 and 5xx as retryable', () => {
    expect(classifyHttpStatus(429).retryable).toBe(true)
    expect(classifyHttpStatus(500).retryable).toBe(true)
    expect(classifyHttpStatus(503).retryable).toBe(true)
  })

  it('treats auth and validation as permanent', () => {
    expect(classifyHttpStatus(401).retryable).toBe(false)
    expect(classifyHttpStatus(403).retryable).toBe(false)
    expect(classifyHttpStatus(400).retryable).toBe(false)
    expect(classifyHttpStatus(422).retryable).toBe(false)
  })

  it('applies bounded exponential backoff with jitter', () => {
    const ms = computeBackoffMs({
      attempt: 1,
      baseDelayMs: 1_000,
      maxDelayMs: 10_000,
      random: () => 0,
    })
    expect(ms).toBeGreaterThanOrEqual(500)
    expect(ms).toBeLessThanOrEqual(1_000)
  })

  it('respects Retry-After when larger than backoff', () => {
    const ms = computeBackoffMs({
      attempt: 1,
      baseDelayMs: 1_000,
      maxDelayMs: 60_000,
      retryAfterMs: 45_000,
      random: () => 0,
    })
    expect(ms).toBe(45_000)
  })

  it('parses Retry-After seconds', () => {
    expect(parseRetryAfterMs('30')).toBe(30_000)
  })

  it('computes nextRetryAt ISO string', () => {
    const at = computeNextRetryAt({
      attempt: 1,
      baseDelayMs: 1_000,
      maxDelayMs: 10_000,
      nowMs: 1_000_000,
      random: () => 0,
    })
    expect(Date.parse(at)).toBeGreaterThan(1_000_000)
  })

  it('detects abort/timeout errors', () => {
    expect(isAbortTimeoutError(new DOMException('Aborted', 'AbortError'))).toBe(true)
    expect(isAbortTimeoutError(new Error('other'))).toBe(false)
  })

  it('isRetryDue when missing or past', () => {
    expect(isRetryDue(null, 1000)).toBe(true)
    expect(isRetryDue(new Date(500).toISOString(), 1000)).toBe(true)
    expect(isRetryDue(new Date(2000).toISOString(), 1000)).toBe(false)
  })
})
