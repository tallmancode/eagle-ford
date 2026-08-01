type ConsentState = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function ensureGtag(): void {
  window.dataLayer = window.dataLayer || []
  if (typeof window.gtag === 'function') return

  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
}

export function updateGoogleConsent(accepted: boolean): void {
  if (typeof window === 'undefined') return

  ensureGtag()

  const state: ConsentState = accepted ? 'granted' : 'denied'

  window.gtag?.('consent', 'update', {
    ad_storage: state,
    analytics_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  })
}
