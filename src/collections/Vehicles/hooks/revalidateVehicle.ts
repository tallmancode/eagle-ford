import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Vehicle } from '@/payload-types'

export const revalidateVehicle: CollectionAfterChangeHook<Vehicle> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/vehicles/${doc.slug}`

      payload.logger.info(`Revalidating vehicle at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/vehicles')
      revalidateTag('vehicles', 'max')
      revalidateTag('sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const path = `/vehicles/${previousDoc.slug}`

      payload.logger.info(`Revalidating previously published vehicle: ${path}`)

      revalidatePath(path)
      revalidatePath('/vehicles')
      revalidateTag('vehicles', 'max')
      revalidateTag('sitemap', 'max')
    }
  }

  return doc
}

export const revalidateVehicleDelete: CollectionAfterDeleteHook<Vehicle> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidatePath(`/vehicles/${doc?.slug}`)
    revalidatePath('/vehicles')
    revalidateTag('vehicles', 'max')
    revalidateTag('sitemap', 'max')
  }

  return doc
}
