import { cleanup, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ConsentAwareGoogleTagManager } from '@/components/analytics/ConsentAwareGoogleTagManager'

const privacyState = vi.hoisted<{ cookieConsent: boolean | undefined }>(() => ({
  cookieConsent: undefined,
}))

vi.mock('@/lib/providers/privacy', () => ({
  usePrivacy: () => privacyState,
}))

vi.mock('@next/third-parties/google', () => ({
  GoogleTagManager: ({ gtmId }: { gtmId: string }) =>
    createElement('div', {
      'data-testid': 'google-tag-manager',
      'data-gtm-id': gtmId,
    }),
}))

afterEach(() => {
  cleanup()
  privacyState.cookieConsent = undefined
})

describe('ConsentAwareGoogleTagManager', () => {
  it('does not render when Google Tag Manager is disabled', () => {
    privacyState.cookieConsent = true

    render(
      createElement(ConsentAwareGoogleTagManager, {
        enabled: false,
        containerId: 'GTM-P2JCNCLC',
      }),
    )

    expect(screen.queryByTestId('google-tag-manager')).toBeNull()
  })

  it('does not render before cookie consent is granted', () => {
    privacyState.cookieConsent = false

    render(
      createElement(ConsentAwareGoogleTagManager, {
        enabled: true,
        containerId: 'GTM-P2JCNCLC',
      }),
    )

    expect(screen.queryByTestId('google-tag-manager')).toBeNull()
  })

  it('does not render for an invalid container ID', () => {
    privacyState.cookieConsent = true

    render(
      createElement(ConsentAwareGoogleTagManager, {
        enabled: true,
        containerId: 'not-a-gtm-id',
      }),
    )

    expect(screen.queryByTestId('google-tag-manager')).toBeNull()
  })

  it('renders the configured container after consent is granted', () => {
    privacyState.cookieConsent = true

    render(
      createElement(ConsentAwareGoogleTagManager, {
        enabled: true,
        containerId: ' GTM-P2JCNCLC ',
      }),
    )

    expect(screen.getByTestId('google-tag-manager').getAttribute('data-gtm-id')).toBe(
      'GTM-P2JCNCLC',
    )
  })
})
