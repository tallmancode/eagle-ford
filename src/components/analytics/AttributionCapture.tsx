'use client'

import { useEffect } from 'react'

import { captureAttribution } from '@/lib/attribution/captureAttribution'

/** Capture gclid / UTMs on first paint and persist for 90 days. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution()
  }, [])

  return null
}
