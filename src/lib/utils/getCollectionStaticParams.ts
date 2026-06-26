import configPromise from '@payload-config'
import { getPayload } from 'payload'

type SlugCollection = 'blog'

export async function getCollectionStaticParams(
  collection: SlugCollection,
): Promise<{ slug: string }[]> {
  if (!process.env.PAYLOAD_SECRET?.trim() || !process.env.DATABASE_URL?.trim()) {
    return []
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection,
      draft: false,
      limit: 1000,
      overrideAccess: false,
      pagination: false,
      select: {
        slug: true,
      },
    })

    return result.docs.flatMap(({ slug }) => (slug ? [{ slug }] : []))
  } catch (error) {
    console.warn(`Skipping static params for "${String(collection)}" during build.`, error)
    return []
  }
}
