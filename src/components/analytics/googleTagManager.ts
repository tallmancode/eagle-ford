const GOOGLE_TAG_MANAGER_ID_PATTERN = /^GTM-[A-Z0-9]+$/

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
  if (!args.enabled) return null

  return normalizeGoogleTagManagerId(args.containerId)
}
