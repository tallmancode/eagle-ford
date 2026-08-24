import { describe, expect, it } from 'vitest'

import { gtmCtaProps } from '@/components/analytics/gtmCtaProps'

describe('gtmCtaProps', () => {
  it('emits data attributes by default', () => {
    expect(
      gtmCtaProps({
        name: 'Book a Test Drive',
        location: 'cta-button',
      }),
    ).toEqual({
      'data-gtm-cta': 'book-a-test-drive',
      'data-gtm-cta-location': 'cta-button',
    })
  })

  it('emits data attributes when trackAsCta is true', () => {
    expect(
      gtmCtaProps({
        trackAsCta: true,
        name: 'Enquire',
        location: 'cta-button',
      }),
    ).toEqual({
      'data-gtm-cta': 'enquire',
      'data-gtm-cta-location': 'cta-button',
    })
  })

  it('returns empty props when trackAsCta is false', () => {
    expect(
      gtmCtaProps({
        trackAsCta: false,
        name: 'Book a Test Drive',
        location: 'cta-button',
      }),
    ).toEqual({})
  })

  it('returns empty props when the name slugifies to empty', () => {
    expect(
      gtmCtaProps({
        name: '!!!',
        location: 'cta-button',
      }),
    ).toEqual({})
  })
})
