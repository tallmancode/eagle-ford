import { cleanup, render } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GTMPageView } from '@/components/analytics/GTMPageView'

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
})

beforeEach(() => {
  sendGTMEvent.mockClear()
  usePathname.mockReset()
  useSearchParams.mockReset()
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
})
