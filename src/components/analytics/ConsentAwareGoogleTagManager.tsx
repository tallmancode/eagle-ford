'use client'

import { GoogleTagManager } from '@next/third-parties/google'

import { usePrivacy } from '@/lib/providers/privacy'

type ConsentAwareGoogleTagManagerProps = {
  enabled?: boolean | null
  containerId?: string | null
}

const GOOGLE_TAG_MANAGER_ID_PATTERN = /^GTM-[A-Z0-9]+$/

export function ConsentAwareGoogleTagManager({
  enabled,
  containerId,
}: ConsentAwareGoogleTagManagerProps) {
  const { cookieConsent } = usePrivacy()
  const normalizedContainerId = containerId?.trim()

  if (
    !enabled ||
    cookieConsent !== true ||
    !normalizedContainerId ||
    !GOOGLE_TAG_MANAGER_ID_PATTERN.test(normalizedContainerId)
  ) {
    return null
  }

  return <GoogleTagManager gtmId={normalizedContainerId} />
}
