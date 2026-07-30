import { revalidatePath, revalidateTag } from 'next/cache'

export const CACHE_TAGS = [
  'global_header',
  'global_footer',
  'global_settings',
  'vehicles',
  'vehicle-models',
  'vehicle-variants',
  'specials',
  'sitemap',
  'redirects',
  'motor-city-stock',
  'motor-city-stock-filters',
  'motor-city-stock-vehicle',
] as const

const REVALIDATED_PATHS = ['/'] as const

export type BustAllCachesResult = {
  tags: readonly string[]
  paths: readonly string[]
}

export function bustAllCaches(): BustAllCachesResult {
  for (const tag of CACHE_TAGS) {
    revalidateTag(tag, 'max')
  }

  revalidatePath('/', 'layout')

  return {
    tags: CACHE_TAGS,
    paths: REVALIDATED_PATHS,
  }
}
