import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  isAnalyticsLiveProduction,
  normalizeGoogleTagManagerId,
  shouldLoadGoogleTagManager,
} from '@/components/analytics/googleTagManager'

describe('googleTagManager', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('isAnalyticsLiveProduction', () => {
    it('returns true when NODE_ENV is production and indexing is allowed', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('ALLOW_SEARCH_INDEXING', 'true')
      expect(isAnalyticsLiveProduction()).toBe(true)
    })

    it('returns false when NODE_ENV is development', () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('ALLOW_SEARCH_INDEXING', 'true')
      expect(isAnalyticsLiveProduction()).toBe(false)
    })

    it('returns false for staging (production NODE_ENV, indexing off)', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('ALLOW_SEARCH_INDEXING', 'false')
      expect(isAnalyticsLiveProduction()).toBe(false)
    })
  })

  describe('shouldLoadGoogleTagManager', () => {
    it('returns null outside live production even when CMS analytics is enabled', () => {
      vi.stubEnv('NODE_ENV', 'development')
      vi.stubEnv('ALLOW_SEARCH_INDEXING', 'true')

      expect(
        shouldLoadGoogleTagManager({
          enabled: true,
          containerId: 'GTM-P2JCNCLC',
        }),
      ).toBeNull()
    })

    it('returns null on staging (indexing off) even when CMS analytics is enabled', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('ALLOW_SEARCH_INDEXING', 'false')

      expect(
        shouldLoadGoogleTagManager({
          enabled: true,
          containerId: 'GTM-P2JCNCLC',
        }),
      ).toBeNull()
    })

    it('returns the normalized container ID in live production when enabled', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('ALLOW_SEARCH_INDEXING', 'true')

      expect(
        shouldLoadGoogleTagManager({
          enabled: true,
          containerId: ' GTM-P2JCNCLC ',
        }),
      ).toBe('GTM-P2JCNCLC')
    })

    it('returns null in live production when disabled', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubEnv('ALLOW_SEARCH_INDEXING', 'true')

      expect(
        shouldLoadGoogleTagManager({
          enabled: false,
          containerId: 'GTM-P2JCNCLC',
        }),
      ).toBeNull()
    })
  })

  describe('normalizeGoogleTagManagerId', () => {
    it('rejects invalid container IDs', () => {
      expect(normalizeGoogleTagManagerId('not-a-gtm-id')).toBeNull()
    })
  })
})
