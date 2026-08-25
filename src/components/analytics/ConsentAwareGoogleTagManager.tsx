'use client'

import { GoogleTagManager } from '@next/third-parties/google'

type ConsentAwareGoogleTagManagerProps = {
  gtmId: string | null
}

/**
 * Mounts the GTM container when the server has already decided it should load
 * (live production + CMS enabled + valid ID). Do not re-check env here —
 * ALLOW_SEARCH_INDEXING is not available in the browser bundle.
 * Consent Mode (not mount gating) controls storage.
 */
export function ConsentAwareGoogleTagManager({ gtmId }: ConsentAwareGoogleTagManagerProps) {
  if (!gtmId) {
    return null
  }

  return <GoogleTagManager gtmId={gtmId} />
}
