import { cleanup, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ConsentAwareGoogleTagManager } from '@/components/analytics/ConsentAwareGoogleTagManager'

vi.mock('@next/third-parties/google', () => ({
  GoogleTagManager: ({ gtmId }: { gtmId: string }) =>
    createElement('div', {
      'data-testid': 'google-tag-manager',
      'data-gtm-id': gtmId,
    }),
}))

afterEach(() => {
  cleanup()
})

describe('ConsentAwareGoogleTagManager', () => {
  it('does not render when Google Tag Manager is disabled', () => {
    render(
      createElement(ConsentAwareGoogleTagManager, {
        enabled: false,
        containerId: 'GTM-P2JCNCLC',
      }),
    )

    expect(screen.queryByTestId('google-tag-manager')).toBeNull()
  })

  it('renders when enabled even before cookie consent is granted', () => {
    render(
      createElement(ConsentAwareGoogleTagManager, {
        enabled: true,
        containerId: 'GTM-P2JCNCLC',
      }),
    )

    expect(screen.getByTestId('google-tag-manager').getAttribute('data-gtm-id')).toBe(
      'GTM-P2JCNCLC',
    )
  })

  it('does not render for an invalid container ID', () => {
    render(
      createElement(ConsentAwareGoogleTagManager, {
        enabled: true,
        containerId: 'not-a-gtm-id',
      }),
    )

    expect(screen.queryByTestId('google-tag-manager')).toBeNull()
  })

  it('renders the configured container when enabled', () => {
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
