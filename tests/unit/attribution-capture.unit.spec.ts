import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ATTRIBUTION_STORAGE_KEY,
  ATTRIBUTION_TTL_MS,
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

  it('uses last-touch gclid within the 90-day window', () => {
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

    expect(second?.gclid).toBe('second-click')
    expect(second?.utm_campaign).toBe('later')
    expect(second?.landing_page).toBe('/sell')
    expect(JSON.parse(localStorage.getItem(ATTRIBUTION_STORAGE_KEY) || '{}').gclid).toBe(
      'second-click',
    )
  })

  it('resets capturedAt when a new gclid arrives', () => {
    captureAttribution({
      search: '?gclid=first-click',
      pathname: '/',
      now: Date.parse('2026-08-01T10:00:00.000Z'),
    })

    const second = captureAttribution({
      search: '?gclid=second-click',
      pathname: '/sell',
      now: Date.parse('2026-08-26T10:00:00.000Z'),
    })

    expect(second?.capturedAt).toBe(new Date(Date.parse('2026-08-26T10:00:00.000Z')).toISOString())
  })

  it('allows a fresh gclid after the 90-day TTL expires', () => {
    const start = Date.parse('2026-01-01T10:00:00.000Z')
    captureAttribution({
      search: '?gclid=old-click',
      pathname: '/',
      now: start,
    })

    const afterExpiry = captureAttribution({
      search: '?gclid=new-click',
      pathname: '/',
      now: start + ATTRIBUTION_TTL_MS + 1,
    })

    expect(afterExpiry?.gclid).toBe('new-click')
  })

  it('keeps stored gclid on UTM-only visits', () => {
    captureAttribution({
      search: '?gclid=stored-click',
      pathname: '/',
      now: Date.parse('2026-08-01T10:00:00.000Z'),
    })

    const utmOnly = captureAttribution({
      search: '?utm_campaign=organic',
      pathname: '/contact',
      now: Date.parse('2026-08-26T10:00:00.000Z'),
    })

    expect(utmOnly?.gclid).toBe('stored-click')
    expect(utmOnly?.utm_campaign).toBeUndefined()
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
