import { cleanup, render, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ThankYouGate } from '@/components/ThankYouGate'
import { armThankYouGate } from '@/lib/forms/thankYouGate'

const sendGTMEvent = vi.fn()
const replace = vi.fn()

vi.mock('@next/third-parties/google', () => ({
  sendGTMEvent: (...args: unknown[]) => sendGTMEvent(...args),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}))

beforeEach(() => {
  sendGTMEvent.mockClear()
  replace.mockClear()
  sessionStorage.clear()
  document.documentElement.setAttribute('data-analytics', 'live')
})

afterEach(() => {
  cleanup()
  sessionStorage.clear()
  document.documentElement.removeAttribute('data-analytics')
})

describe('ThankYouGate', () => {
  it('fires one page_view when the one-time gate token is present', async () => {
    armThankYouGate('/sales-form-submitted')

    render(
      createElement(
        ThankYouGate,
        { slug: 'sales-form-submitted' },
        createElement('p', null, 'Thank you'),
      ),
    )

    await waitFor(() => {
      expect(sendGTMEvent).toHaveBeenCalledWith({
        event: 'page_view',
        page_path: '/sales-form-submitted',
      })
    })

    expect(replace).not.toHaveBeenCalled()
    expect(sendGTMEvent).toHaveBeenCalledTimes(1)
  })

  it('redirects home without page_view when the gate token is missing', async () => {
    render(
      createElement(
        ThankYouGate,
        { slug: 'sales-form-submitted' },
        createElement('p', null, 'Thank you'),
      ),
    )

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/')
    })

    expect(sendGTMEvent).not.toHaveBeenCalled()
  })
})
