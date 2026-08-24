import canUseDOM from '@/lib/utils/canUseDOM'

/**
 * Client-side gate for dataLayer / marketing events.
 * Layout sets `data-analytics="live"` on `<html>` only when
 * `isAnalyticsLiveProduction()` is true (server env). Staging and local
 * never get the marker, so events stay silent even if CMS GTM is enabled.
 */
export function canSendAnalytics(): boolean {
  if (!canUseDOM) return false
  return document.documentElement.getAttribute('data-analytics') === 'live'
}
