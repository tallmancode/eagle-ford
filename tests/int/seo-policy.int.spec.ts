import { describe, expect, it } from 'vitest'

import { getDefaultRobots, isSearchIndexingEnabled } from '@/constants/crawlerPolicy'
import { getBreadcrumbJsonLd } from '@/lib/seo/dealershipJsonLd'

describe('crawlerPolicy', () => {
  it('defaults to blocked indexing without ALLOW_SEARCH_INDEXING', () => {
    const previous = process.env.ALLOW_SEARCH_INDEXING
    delete process.env.ALLOW_SEARCH_INDEXING
    expect(isSearchIndexingEnabled()).toBe(false)
    expect(getDefaultRobots()).toMatchObject({ index: false, follow: false })
    if (previous === undefined) delete process.env.ALLOW_SEARCH_INDEXING
    else process.env.ALLOW_SEARCH_INDEXING = previous
  })
})

describe('getBreadcrumbJsonLd', () => {
  it('builds BreadcrumbList positions', () => {
    const json = getBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Vehicles', path: '/vehicles' },
    ])
    expect(json).not.toBeNull()
    expect(json!['@type']).toBe('BreadcrumbList')
    expect(json!.itemListElement).toHaveLength(2)
  })
})
