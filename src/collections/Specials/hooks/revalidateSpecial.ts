import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Special } from '@/payload-types'

export const revalidateSpecial: CollectionAfterChangeHook<Special> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating special at path: /specials/${doc.slug}`)

      revalidatePath('/local/specials')
      revalidatePath('/specials')
      revalidatePath(`/specials/${doc.slug}`)
      revalidateTag('specials', 'max')
      revalidateTag('sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidatePath('/local/specials')
      revalidatePath('/specials')
      revalidatePath(`/specials/${previousDoc.slug}`)
      revalidateTag('specials', 'max')
      revalidateTag('sitemap', 'max')
    }
  }

  return doc
}

export const revalidateSpecialDelete: CollectionAfterDeleteHook<Special> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath('/local/specials')
    revalidatePath('/specials')
    revalidatePath(`/specials/${doc?.slug}`)
    revalidateTag('specials', 'max')
    revalidateTag('sitemap', 'max')
  }

  return doc
}
