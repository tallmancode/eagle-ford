import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GTMCtaClickTracker } from '@/components/analytics/GTMCtaClickTracker'

const sendGTMEvent = vi.fn()

vi.mock('@next/third-parties/google', () => ({
  sendGTMEvent: (...args: unknown[]) => sendGTMEvent(...args),
}))

afterEach(() => {
  cleanup()
})

beforeEach(() => {
  sendGTMEvent.mockClear()
})

describe('GTMCtaClickTracker', () => {
  it('fires a cta_click event when an element with data-gtm-cta is clicked', () => {
    render(
      createElement(
        'div',
        null,
        createElement(GTMCtaClickTracker, { gtmId: 'GTM-P2JCNCLC' }),
        createElement(
          'button',
          { 'data-gtm-cta': 'test-cta', 'data-gtm-cta-location': 'test' },
          'Click',
        ),
      ),
    )

    fireEvent.click(screen.getByText('Click'))

    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: 'cta_click',
      cta_name: 'test-cta',
      cta_location: 'test',
      cta_href: null,
    })
  })

  it('does not fire when clicking an element without data-gtm-cta', () => {
    render(
      createElement(
        'div',
        null,
        createElement(GTMCtaClickTracker, { gtmId: 'GTM-P2JCNCLC' }),
        createElement('button', null, 'No Tracking'),
      ),
    )

    fireEvent.click(screen.getByText('No Tracking'))

    expect(sendGTMEvent).not.toHaveBeenCalled()
  })

  it('does not attach a click listener when gtmId is null', () => {
    render(
      createElement(
        'div',
        null,
        createElement(GTMCtaClickTracker, { gtmId: null }),
        createElement('button', { 'data-gtm-cta': 'test-cta' }, 'Click'),
      ),
    )

    fireEvent.click(screen.getByText('Click'))

    expect(sendGTMEvent).not.toHaveBeenCalled()
  })
})
