import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const normalizePath = (path: string) => {
  const decoded = decodeURIComponent(path)
  if (!decoded || decoded === 'home') return '/'
  return decoded.startsWith('/') ? decoded : `/${decoded}`
}

const pathToCacheTag = (path: string) =>
  `pages_path_${path.replace(/^\//, '').replace(/\//g, '_') || 'home'}`

export async function getPageByPath(path: string, draft: boolean) {
  const payload = await getPayload({ config: configPromise })
  const normalizedPath = normalizePath(path)

  if (normalizedPath === '/') {
    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: { equals: 'home' },
        ...(draft ? {} : { _status: { equals: 'published' } }),
      },
    })

    return result.docs?.[0] || null
  }

  const segments = normalizedPath.replace(/^\//, '').split('/')
  const lastSegment = segments[segments.length - 1]

  const nestedResult = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      and: [
        { slug: { equals: lastSegment } },
        { 'breadcrumbs.url': { equals: normalizedPath } },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  if (nestedResult.docs?.[0]) {
    return nestedResult.docs[0]
  }

  if (segments.length === 1) {
    const fallbackResult = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: { equals: lastSegment },
        ...(draft ? {} : { _status: { equals: 'published' } }),
      },
    })

    return fallbackResult.docs?.[0] || null
  }

  return null
}

export const getCachedPageByPath = (path: string) => {
  const normalizedPath = normalizePath(path)
  const cacheKey = normalizedPath.replace(/^\//, '') || 'home'

  return unstable_cache(async () => getPageByPath(normalizedPath, false), ['pages', cacheKey], {
    tags: [pathToCacheTag(normalizedPath), `pages_${cacheKey}`],
  })
}
