import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { SpecialTemplate } from '@/payload-types'

export const revalidateSpecialTemplate: CollectionAfterChangeHook<SpecialTemplate> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating specials after template change: ${doc.title}`)

      revalidatePath('/specials')
      revalidatePath('/local/specials')
      revalidateTag('specials', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      payload.logger.info(`Revalidating specials after template unpublish: ${doc.title}`)

      revalidatePath('/specials')
      revalidatePath('/local/specials')
      revalidateTag('specials', 'max')
    }
  }

  return doc
}

export const revalidateSpecialTemplateDelete: CollectionAfterDeleteHook<SpecialTemplate> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating specials after template delete: ${doc?.title}`)

    revalidatePath('/specials')
    revalidatePath('/local/specials')
    revalidateTag('specials', 'max')
  }

  return doc
}
