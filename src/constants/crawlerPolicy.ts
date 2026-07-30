import type { Metadata, MetadataRoute } from 'next'

import { getServerSideURL } from '@/lib/utils/getServerSideURL'

/**
 * Staging and local builds stay blocked from indexing by default.
 * Set ALLOW_SEARCH_INDEXING=true on the production deploy that should appear in search.
 */
export function isSearchIndexingEnabled(): boolean {
  return process.env.ALLOW_SEARCH_INDEXING === 'true'
}

export const CRAWLER_BLOCK_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
}

export const CRAWLER_ALLOW_ROBOTS: Metadata['robots'] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
}

/** Default robots metadata for public pages (honours ALLOW_SEARCH_INDEXING). */
export function getDefaultRobots(): Metadata['robots'] {
  return isSearchIndexingEnabled() ? CRAWLER_ALLOW_ROBOTS : CRAWLER_BLOCK_ROBOTS
}

/** Always noindex — search, admin-adjacent, and utility routes. */
export const CRAWLER_NOINDEX_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
}

export function getRobotsRouteConfig(): MetadataRoute.Robots {
  const siteUrl = getServerSideURL().replace(/\/$/, '')

  if (!isSearchIndexingEnabled()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/search/', '/next/', '/monitoring'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
