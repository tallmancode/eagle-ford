import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { getSpecialCategoryPath } from '@/lib/specials/paths'
import type { SpecialCategory } from '@/payload-types'

function revalidateCategoryPaths(slug: string | null | undefined) {
  revalidatePath('/specials')
  revalidatePath('/local/specials')

  if (slug) {
    revalidatePath(getSpecialCategoryPath(slug))
  }

  revalidateTag('specials', 'max')
  revalidateTag('sitemap', 'max')
}

export const revalidateSpecialCategory: CollectionAfterChangeHook<SpecialCategory> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(
      `Revalidating special category at path: ${getSpecialCategoryPath(doc.slug)}`,
    )

    revalidateCategoryPaths(doc.slug)

    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidatePath(getSpecialCategoryPath(previousDoc.slug))
    }
  }

  return doc
}

export const revalidateSpecialCategoryDelete: CollectionAfterDeleteHook<SpecialCategory> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidateCategoryPaths(doc?.slug)
  }

  return doc
}
