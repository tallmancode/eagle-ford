'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

import { consumeThankYouGate } from '@/lib/forms/thankYouGate'

type ThankYouGateProps = {
  slug: string
  children: ReactNode
}

/**
 * Allows thank-you page content only once after a successful form redirect.
 * Direct visits, refresh, and back-navigation send the visitor home.
 */
export function ThankYouGate({ slug, children }: ThankYouGateProps) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (consumeThankYouGate(slug)) {
      setAllowed(true)
      return
    }
    router.replace('/')
  }, [slug, router])

  if (!allowed) {
    return null
  }

  return children
}
