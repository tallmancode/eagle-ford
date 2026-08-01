'use client'

import { GoogleTagManager } from '@next/third-parties/google'

import { normalizeGoogleTagManagerId } from '@/components/analytics/googleTagManager'

type ConsentAwareGoogleTagManagerProps = {
  enabled?: boolean | null
  containerId?: string | null
}

/**
 * Loads GTM whenever CMS analytics is enabled and the container ID is valid.
 * Consent Mode (not mount gating) controls whether tags may use storage.
 */
export function ConsentAwareGoogleTagManager({
  enabled,
  containerId,
}: ConsentAwareGoogleTagManagerProps) {
  const normalizedContainerId = normalizeGoogleTagManagerId(containerId)

  if (!enabled || !normalizedContainerId) {
    return null
  }

  return <GoogleTagManager gtmId={normalizedContainerId} />
}
