import type { Metadata } from 'next'

/**
 * Staging/dev hosts stay noindex unless explicitly opted in.
 * Set ALLOW_SEARCH_INDEXING=true on the production deployment to allow Google.
 */
export const ALLOW_SEARCH_INDEXING = process.env.ALLOW_SEARCH_INDEXING === 'true'

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

/** Active robots policy for the current environment. */
export const CRAWLER_ROBOTS: Metadata['robots'] = ALLOW_SEARCH_INDEXING
  ? CRAWLER_ALLOW_ROBOTS
  : CRAWLER_BLOCK_ROBOTS
