import { describe, expect, it } from 'vitest'

import { aggregateFormSubmissionMetrics } from '@/lib/form-submissions/aggregateMetrics'
import { isFormSubmissionsApiAuthorized } from '@/lib/form-submissions/apiAuth'
import {
  parseFeedPagination,
  parseFormSubmissionsDateRange,
  toUtcDayKey,
} from '@/lib/form-submissions/dateRange'

describe('aggregateFormSubmissionMetrics', () => {
  it('groups by form and day', () => {
    const result = aggregateFormSubmissionMetrics(
      [
        {
          id: '1',
          form: { id: 'f1', title: 'General Enquiry' },
          createdAt: '2026-08-01T10:00:00.000Z',
        },
        {
          id: '2',
          form: { id: 'f1', title: 'General Enquiry' },
          createdAt: '2026-08-01T18:00:00.000Z',
        },
        {
          id: '3',
          form: { id: 'f2', title: 'Service Booking' },
          createdAt: '2026-08-02T09:00:00.000Z',
        },
      ],
      {
        siteKey: 'eagle-ford',
        fromIso: '2026-08-01T00:00:00.000Z',
        toIso: '2026-08-31T23:59:59.999Z',
      },
    )

    expect(result.siteKey).toBe('eagle-ford')
    expect(result.total).toBe(3)
    expect(result.byForm).toEqual([
      { formId: 'f1', formTitle: 'General Enquiry', count: 2 },
      { formId: 'f2', formTitle: 'Service Booking', count: 1 },
    ])
    expect(result.byDay).toEqual([
      { date: '2026-08-01', count: 2 },
      { date: '2026-08-02', count: 1 },
    ])
  })

  it('handles missing form relationships', () => {
    const result = aggregateFormSubmissionMetrics(
      [{ id: '1', form: null, createdAt: '2026-08-01T00:00:00.000Z' }],
      {
        siteKey: 'eagle-ford',
        fromIso: '2026-08-01T00:00:00.000Z',
        toIso: '2026-08-01T23:59:59.999Z',
      },
    )
    expect(result.byForm).toEqual([{ formId: 'unknown', formTitle: 'Unknown form', count: 1 }])
  })
})

describe('parseFormSubmissionsDateRange', () => {
  it('defaults to last 30 UTC days inclusive', () => {
    const now = new Date('2026-08-25T15:00:00.000Z')
    const range = parseFormSubmissionsDateRange(new URLSearchParams(), now)
    expect('error' in range).toBe(false)
    if ('error' in range) return
    expect(range.fromIso).toBe('2026-07-27T00:00:00.000Z')
    expect(range.toIso).toBe('2026-08-25T23:59:59.999Z')
  })

  it('rejects inverted ranges', () => {
    const params = new URLSearchParams({
      from: '2026-08-20',
      to: '2026-08-10',
    })
    const range = parseFormSubmissionsDateRange(params)
    expect(range).toEqual({ error: '`from` must be on or before `to`' })
  })
})

describe('parseFeedPagination', () => {
  it('clamps limit to 50', () => {
    expect(parseFeedPagination(new URLSearchParams({ limit: '999' }))).toEqual({
      page: 1,
      limit: 50,
    })
  })
})

describe('toUtcDayKey', () => {
  it('returns YYYY-MM-DD', () => {
    expect(toUtcDayKey('2026-08-01T23:30:00.000Z')).toBe('2026-08-01')
  })
})

describe('isFormSubmissionsApiAuthorized', () => {
  it('rejects when env key is missing', () => {
    const prev = process.env.FORM_SUBMISSIONS_API_KEY
    delete process.env.FORM_SUBMISSIONS_API_KEY
    try {
      const request = new Request('http://localhost/api/form-submissions/metrics', {
        headers: { Authorization: 'Bearer secret' },
      })
      expect(isFormSubmissionsApiAuthorized(request)).toBe(false)
    } finally {
      if (prev === undefined) delete process.env.FORM_SUBMISSIONS_API_KEY
      else process.env.FORM_SUBMISSIONS_API_KEY = prev
    }
  })

  it('accepts matching bearer token', () => {
    const prev = process.env.FORM_SUBMISSIONS_API_KEY
    process.env.FORM_SUBMISSIONS_API_KEY = 'test-secret-key'
    try {
      const ok = new Request('http://localhost/api/form-submissions/metrics', {
        headers: { Authorization: 'Bearer test-secret-key' },
      })
      const bad = new Request('http://localhost/api/form-submissions/metrics', {
        headers: { Authorization: 'Bearer wrong' },
      })
      expect(isFormSubmissionsApiAuthorized(ok)).toBe(true)
      expect(isFormSubmissionsApiAuthorized(bad)).toBe(false)
    } finally {
      if (prev === undefined) delete process.env.FORM_SUBMISSIONS_API_KEY
      else process.env.FORM_SUBMISSIONS_API_KEY = prev
    }
  })
})
