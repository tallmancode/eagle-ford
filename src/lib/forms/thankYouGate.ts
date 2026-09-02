export const THANK_YOU_SESSION_KEY = 'eagle-ford:thank-you'
export const SKIP_PAGE_VIEW_KEY = 'eagle-ford:skip-page-view'

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

/** Suppress the next global page_view (e.g. after bouncing from an invalid thank-you visit). */
export function suppressNextPageView(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(SKIP_PAGE_VIEW_KEY, '1')
  } catch {
    // Ignore storage failures.
  }
}

/** Returns true once, then clears the suppression flag. */
export function consumePageViewSuppression(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const flag = sessionStorage.getItem(SKIP_PAGE_VIEW_KEY)
    if (!flag) return false
    sessionStorage.removeItem(SKIP_PAGE_VIEW_KEY)
    return true
  } catch {
    return false
  }
}
