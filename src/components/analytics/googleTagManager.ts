const GOOGLE_TAG_MANAGER_ID_PATTERN = /^GTM-[A-Z0-9]+$/

/**
 * Live production only — staging Docker also uses NODE_ENV=production, so also
 * require ALLOW_SEARCH_INDEXING=true (set by deploy.yml, false on staging).
 */
export function isAnalyticsLiveProduction(): boolean {
  return (
    process.env.NODE_ENV === 'production' &&
    process.env.ALLOW_SEARCH_INDEXING === 'true'
  )
}

export function normalizeGoogleTagManagerId(
  containerId?: string | null,
): string | null {
  const normalizedContainerId = containerId?.trim()

  if (!normalizedContainerId || !GOOGLE_TAG_MANAGER_ID_PATTERN.test(normalizedContainerId)) {
    return null
  }

  return normalizedContainerId
}

export function shouldLoadGoogleTagManager(args: {
  enabled?: boolean | null
  containerId?: string | null
}): string | null {
  if (!isAnalyticsLiveProduction()) return null
  if (!args.enabled) return null

  return normalizeGoogleTagManagerId(args.containerId)
}
