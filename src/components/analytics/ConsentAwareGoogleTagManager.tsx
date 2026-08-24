'use client'

import { GoogleTagManager } from '@next/third-parties/google'

import { shouldLoadGoogleTagManager } from '@/components/analytics/googleTagManager'

type ConsentAwareGoogleTagManagerProps = {
  enabled?: boolean | null
  containerId?: string | null
}

/**
 * Loads GTM only on live production when CMS analytics is enabled and the
 * container ID is valid. Consent Mode (not mount gating) controls storage.
 */
export function ConsentAwareGoogleTagManager({
  enabled,
  containerId,
}: ConsentAwareGoogleTagManagerProps) {
  const gtmId = shouldLoadGoogleTagManager({ enabled, containerId })

  if (!gtmId) {
    return null
  }

  return <GoogleTagManager gtmId={gtmId} />
}
