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
  it('does not render when the server passed no container ID', () => {
    render(createElement(ConsentAwareGoogleTagManager, { gtmId: null }))

    expect(screen.queryByTestId('google-tag-manager')).toBeNull()
  })

  it('renders the server-computed container even before cookie consent is granted', () => {
    render(createElement(ConsentAwareGoogleTagManager, { gtmId: 'GTM-P2JCNCLC' }))

    expect(screen.getByTestId('google-tag-manager').getAttribute('data-gtm-id')).toBe(
      'GTM-P2JCNCLC',
    )
  })
})
