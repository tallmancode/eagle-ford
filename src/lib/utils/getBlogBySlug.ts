import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export async function getBlogBySlug(slug: string, draft: boolean) {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'blog',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    depth: 2,
    where: {
      slug: {
        equals: slug,
      },
      ...(draft ? {} : { _status: { equals: 'published' } }),
    },
  })

  return result.docs?.[0] || null
}

export const getCachedBlogBySlug = (slug: string) =>
  unstable_cache(async () => getBlogBySlug(slug, false), ['blog', slug], {
    tags: [`blog_${slug}`],
  })
