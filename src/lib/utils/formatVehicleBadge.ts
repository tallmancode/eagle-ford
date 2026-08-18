const LEGACY_BADGE_LABELS: Record<string, string> = {
  'newly-launched': 'Newly Launched',
  'coming-soon': 'Coming Soon',
  limited: 'Limited',
}

/**
 * Maps legacy select slugs to their original labels; otherwise returns trimmed free text.
 */
export function formatVehicleBadge(value: unknown): string {
  if (typeof value !== 'string') return ''

  const trimmed = value.trim()
  if (!trimmed) return ''

  return LEGACY_BADGE_LABELS[trimmed] ?? trimmed
}
