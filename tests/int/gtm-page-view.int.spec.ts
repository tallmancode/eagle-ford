import { cleanup, render } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GTMPageView } from '@/components/analytics/GTMPageView'
import { armThankYouGate, suppressNextPageView } from '@/lib/forms/thankYouGate'

const sendGTMEvent = vi.fn()
const usePathname = vi.fn()
const useSearchParams = vi.fn()

vi.mock('@next/third-parties/google', () => ({
  sendGTMEvent: (...args: unknown[]) => sendGTMEvent(...args),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => usePathname(),
  useSearchParams: () => useSearchParams(),
}))

afterEach(() => {
  cleanup()
  sessionStorage.clear()
})

beforeEach(() => {
  sendGTMEvent.mockClear()
  usePathname.mockReset()
  useSearchParams.mockReset()
  sessionStorage.clear()
})

describe('GTMPageView', () => {
  it('fires a page_view event on mount when gtmId is set', () => {
    usePathname.mockReturnValue('/vehicles/ranger')
    useSearchParams.mockReturnValue(new URLSearchParams())

    render(createElement(GTMPageView, { gtmId: 'GTM-P2JCNCLC' }))

    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: 'page_view',
      page_path: '/vehicles/ranger',
    })
  })

  it('does not fire when gtmId is null', () => {
    usePathname.mockReturnValue('/vehicles/ranger')
    useSearchParams.mockReturnValue(new URLSearchParams())

    render(createElement(GTMPageView, { gtmId: null }))

    expect(sendGTMEvent).not.toHaveBeenCalled()
  })

  it('fires again with the new path when the pathname changes', () => {
    usePathname.mockReturnValue('/vehicles/ranger')
    useSearchParams.mockReturnValue(new URLSearchParams())

    const { rerender } = render(createElement(GTMPageView, { gtmId: 'GTM-P2JCNCLC' }))

    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: 'page_view',
      page_path: '/vehicles/ranger',
    })

    sendGTMEvent.mockClear()
    usePathname.mockReturnValue('/vehicles/everest')

    rerender(createElement(GTMPageView, { gtmId: 'GTM-P2JCNCLC' }))

    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: 'page_view',
      page_path: '/vehicles/everest',
    })
  })

  it('fires again when only search params change', () => {
    usePathname.mockReturnValue('/showroom')
    useSearchParams.mockReturnValue(new URLSearchParams())

    const { rerender } = render(createElement(GTMPageView, { gtmId: 'GTM-P2JCNCLC' }))

    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: 'page_view',
      page_path: '/showroom',
    })

    sendGTMEvent.mockClear()
    useSearchParams.mockReturnValue(new URLSearchParams('bodyType=hatch&page=2'))

    rerender(createElement(GTMPageView, { gtmId: 'GTM-P2JCNCLC' }))

    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: 'page_view',
      page_path: '/showroom?bodyType=hatch&page=2',
    })
  })

  it('does not fire page_view on thank-you slugs', () => {
    usePathname.mockReturnValue('/sales-form-submitted')
    useSearchParams.mockReturnValue(new URLSearchParams())

    render(createElement(GTMPageView, { gtmId: 'GTM-P2JCNCLC' }))

    expect(sendGTMEvent).not.toHaveBeenCalled()
  })

  it('skips the next page_view when suppression is armed', () => {
    suppressNextPageView()
    usePathname.mockReturnValue('/')
    useSearchParams.mockReturnValue(new URLSearchParams())

    render(createElement(GTMPageView, { gtmId: 'GTM-P2JCNCLC' }))

    expect(sendGTMEvent).not.toHaveBeenCalled()
  })

  it('fires page_view on thank-you slugs only when armed via ThankYouGate, not GTMPageView', () => {
    armThankYouGate('/sales-form-submitted')
    usePathname.mockReturnValue('/sales-form-submitted')
    useSearchParams.mockReturnValue(new URLSearchParams())

    render(createElement(GTMPageView, { gtmId: 'GTM-P2JCNCLC' }))

    expect(sendGTMEvent).not.toHaveBeenCalled()
  })
})
