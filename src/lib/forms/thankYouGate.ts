export const THANK_YOU_SESSION_KEY = 'eagle-ford:thank-you'

/** Arm one-time access before navigating to a thank-you page. */
export function armThankYouGate(pathOrSlug: string): void {
  if (typeof window === 'undefined') return
  const slug = pathOrSlug.replace(/^\//, '').split(/[?#]/)[0] ?? ''
  if (!slug) return
  try {
    sessionStorage.setItem(THANK_YOU_SESSION_KEY, slug)
  } catch {
    // Ignore quota / private-mode failures — redirect still happens.
  }
}

/**
 * Consume the one-time token. Returns true only on first successful visit
 * after a form redirect; refresh / direct visit returns false.
 */
export function consumeThankYouGate(slug: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const expected = sessionStorage.getItem(THANK_YOU_SESSION_KEY)
    if (expected !== slug) return false
    sessionStorage.removeItem(THANK_YOU_SESSION_KEY)
    return true
  } catch {
    return false
  }
}
