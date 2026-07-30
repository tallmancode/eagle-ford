import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}

/**
 * Request-level dedupe (React cache) + cross-request Data Cache (unstable_cache).
 * Call as `await getCachedGlobal(slug, depth)` — no trailing `()`.
 */
export const getCachedGlobal = cache(
  async <T extends Global>(slug: T, depth = 0): Promise<DataFromGlobalSlug<T>> =>
    unstable_cache(async () => getGlobal(slug, depth), [slug, String(depth)], {
      tags: [`global_${slug}`],
    })(),
)
