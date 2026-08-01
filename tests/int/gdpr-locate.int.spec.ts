import { describe, expect, it } from 'vitest'

import {
  getVisitorCountryFromHeaders,
  isGdprCountry,
  normalizeVisitorCountryCode,
  resolveVisitorGdprStatus,
} from '@/lib/privacy/gdprLocate'

describe('gdprLocate', () => {
  it('normalizes country codes and ignores placeholders', () => {
    expect(normalizeVisitorCountryCode(' za ')).toBe('ZA')
    expect(normalizeVisitorCountryCode('XX')).toBeNull()
    expect(normalizeVisitorCountryCode('T1')).toBeNull()
    expect(normalizeVisitorCountryCode(null)).toBeNull()
  })

  it('reads visitor country from proxy headers in priority order', () => {
    const headers = new Headers({
      'cf-ipcountry': 'ZA',
      'x-country-code': 'DE',
      'x-vercel-ip-country': 'FR',
    })

    expect(getVisitorCountryFromHeaders(headers)).toBe('ZA')
  })

  it('falls back across visitor country headers', () => {
    const headers = new Headers({
      'x-vercel-ip-country': 'DE',
    })

    expect(getVisitorCountryFromHeaders(headers)).toBe('DE')
  })

  it('defaults unknown country to non-GDPR for the ZA-majority audience', () => {
    expect(isGdprCountry(null)).toBe(false)
    expect(resolveVisitorGdprStatus(new Headers()).isGDPR).toBe(false)
  })

  it('treats EU and ZA visitors correctly', () => {
    expect(isGdprCountry('DE')).toBe(true)
    expect(isGdprCountry('ZA')).toBe(false)

    expect(
      resolveVisitorGdprStatus(new Headers({ 'cf-ipcountry': 'DE' })),
    ).toEqual({ country: 'DE', isGDPR: true })

    expect(
      resolveVisitorGdprStatus(new Headers({ 'cf-ipcountry': 'ZA' })),
    ).toEqual({ country: 'ZA', isGDPR: false })
  })
})
