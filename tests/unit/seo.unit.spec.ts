import { describe, expect, it } from 'vitest'

import { pageSeoSeeds } from '@/fixtures/seo-fixtures/page-seo-data'
import { ALLOW_SEARCH_INDEXING, CRAWLER_ROBOTS } from '@/constants/crawlerPolicy'
import { DEFAULT_OG_IMAGE_PATH } from '@/constants/site'
import { existsSync } from 'node:fs'
import path from 'node:path'

describe('page SEO seed data', () => {
  it('has unique slugs for every entry', () => {
    const slugs = pageSeoSeeds.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('provides non-empty title and description under typical SERP limits', () => {
    for (const entry of pageSeoSeeds) {
      expect(entry.slug.length).toBeGreaterThan(0)
      expect(entry.title.trim().length).toBeGreaterThan(0)
      expect(entry.title.includes('| Eagle Ford')).toBe(false)
      expect(entry.description.trim().length).toBeGreaterThan(40)
      expect(entry.description.length).toBeLessThanOrEqual(320)
    }
  })
})

describe('crawler + OG defaults', () => {
  it('defaults to blocking indexing when ALLOW_SEARCH_INDEXING is unset', () => {
    expect(ALLOW_SEARCH_INDEXING).toBe(false)
    expect(CRAWLER_ROBOTS).toMatchObject({ index: false, follow: false })
  })

  it('points DEFAULT_OG_IMAGE_PATH at a file that exists in public/', () => {
    const filePath = path.join(process.cwd(), 'public', DEFAULT_OG_IMAGE_PATH.replace(/^\//, ''))
    expect(existsSync(filePath)).toBe(true)
  })
})
