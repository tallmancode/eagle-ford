'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { sendGTMEvent } from '@next/third-parties/google'

import { isThankYouSlug } from '@/lib/forms/enquiryFormIdentity'
import { consumePageViewSuppression } from '@/lib/forms/thankYouGate'

type Props = { gtmId: string | null }

export function GTMPageView({ gtmId }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!gtmId) return

    const slug = pathname.replace(/^\//, '').split(/[?#]/)[0] ?? ''
    if (isThankYouSlug(slug)) return

    if (consumePageViewSuppression()) return

    const query = searchParams.toString()
    sendGTMEvent({
      event: 'page_view',
      page_path: query ? `${pathname}?${query}` : pathname,
    })
  }, [gtmId, pathname, searchParams])

  return null
}
