import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { getSpecialCategoryPath } from '@/lib/specials/paths'
import type { Special, SpecialCategory } from '@/payload-types'

async function resolveCategorySlug(
  category: string | SpecialCategory | null | undefined,
  payload: Payload,
): Promise<string | null> {
  if (!category) return null
  if (typeof category === 'object' && category.slug) return category.slug

  if (typeof category === 'string') {
    try {
      const doc = await payload.findByID({
        collection: 'special-categories',
        id: category,
        depth: 0,
        select: { slug: true },
      })
      return doc.slug ?? null
    } catch {
      return null
    }
  }

  return null
}

async function revalidateSpecialCategoryPaths(
  payload: Payload,
  category: string | SpecialCategory | null | undefined,
  previousCategory?: string | SpecialCategory | null,
) {
  const slug = await resolveCategorySlug(category, payload)
  if (slug) {
    revalidatePath(getSpecialCategoryPath(slug))
  }

  const previousSlug = await resolveCategorySlug(previousCategory, payload)
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(getSpecialCategoryPath(previousSlug))
  }
}

export const revalidateSpecial: CollectionAfterChangeHook<Special> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating special category for special: ${doc.slug}`)

      revalidatePath('/local/specials')
      revalidatePath('/specials')
      await revalidateSpecialCategoryPaths(payload, doc.category, previousDoc?.category)
      revalidateTag('specials', 'max')
      revalidateTag('sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath('/local/specials')
      revalidatePath('/specials')
      await revalidateSpecialCategoryPaths(payload, previousDoc.category, doc.category)
      revalidateTag('specials', 'max')
      revalidateTag('sitemap', 'max')
    }
  }

  return doc
}

export const revalidateSpecialDelete: CollectionAfterDeleteHook<Special> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/local/specials')
    revalidatePath('/specials')
    await revalidateSpecialCategoryPaths(payload, doc?.category)
    revalidateTag('specials', 'max')
    revalidateTag('sitemap', 'max')
  }

  return doc
}
