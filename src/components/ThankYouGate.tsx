'use client'

import { sendGTMEvent } from '@next/third-parties/google'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type PropsWithChildren } from 'react'

import { canSendAnalytics } from '@/components/analytics/canSendAnalytics'
import { consumeThankYouGate, suppressNextPageView } from '@/lib/forms/thankYouGate'

type ThankYouGateProps = PropsWithChildren<{
  slug: string
}>

/**
 * Allows thank-you page content only once after a successful form redirect.
 * Direct visits, refresh, and back-navigation send the visitor home without
 * firing a conversion page_view.
 */
export function ThankYouGate({ slug, children }: ThankYouGateProps) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)
  const gateHandledRef = useRef(false)

  useEffect(() => {
    if (gateHandledRef.current) return
    gateHandledRef.current = true

    if (consumeThankYouGate(slug)) {
      setAllowed(true)
      if (canSendAnalytics()) {
        sendGTMEvent({
          event: 'page_view',
          page_path: `/${slug}`,
        })
      }
      return
    }
    suppressNextPageView()
    router.replace('/')
  }, [slug, router])

  if (!allowed) {
    return null
  }

  return children
}
