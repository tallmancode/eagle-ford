'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { captureAttribution } from '@/lib/attribution/captureAttribution'

/** Capture gclid / UTMs on route changes; last-touch click ID persisted for 90 days. */
export function AttributionCapture() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    captureAttribution({
      pathname: pathname || '/',
      search: searchParams?.toString() ? `?${searchParams.toString()}` : '',
    })
  }, [pathname, searchParams])

  return null
}
