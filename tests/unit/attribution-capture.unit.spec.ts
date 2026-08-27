import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ATTRIBUTION_STORAGE_KEY,
  captureAttribution,
  readGclidFromCookies,
  readStoredAttribution,
} from '@/lib/attribution/captureAttribution'

describe('captureAttribution', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('stores gclid and UTMs from the landing query string', () => {
    const stored = captureAttribution({
      search: '?gclid=Cj0KCQjw&utm_campaign=ranger&utm_source=google',
      pathname: '/specials/ranger',
      referrer: 'https://google.com/',
      now: Date.parse('2026-08-26T10:00:00.000Z'),
    })

    expect(stored?.gclid).toBe('Cj0KCQjw')
    expect(stored?.utm_campaign).toBe('ranger')
    expect(stored?.landing_page).toBe('/specials/ranger')
    expect(readStoredAttribution()?.gclid).toBe('Cj0KCQjw')
  })

  it('keeps first-touch gclid within the 90-day window', () => {
    captureAttribution({
      search: '?gclid=first-click',
      pathname: '/',
      now: Date.parse('2026-08-01T10:00:00.000Z'),
    })

    const second = captureAttribution({
      search: '?gclid=second-click&utm_campaign=later',
      pathname: '/sell',
      now: Date.parse('2026-08-26T10:00:00.000Z'),
    })

    expect(second?.gclid).toBe('first-click')
    expect(JSON.parse(localStorage.getItem(ATTRIBUTION_STORAGE_KEY) || '{}').gclid).toBe(
      'first-click',
    )
  })

  it('parses gclid from the _gcl_aw cookie value', () => {
    expect(readGclidFromCookies('_gcl_aw=GCL.1720000000.Cj0KCQjwCookie; path=/')).toBe(
      'Cj0KCQjwCookie',
    )
  })

  it('reads gclid from the _gcl_aw cookie when the URL has no click id', () => {
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => '_gcl_aw=GCL.1720000000.Cj0KCQjwCookie',
    })

    const stored = captureAttribution({
      search: '',
      pathname: '/test-drive',
      now: Date.parse('2026-08-26T10:00:00.000Z'),
    })

    expect(stored?.gclid).toBe('Cj0KCQjwCookie')
  })
})
