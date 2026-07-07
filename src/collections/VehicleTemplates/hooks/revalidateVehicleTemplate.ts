import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { VehicleTemplate } from '@/payload-types'

export const revalidateVehicleTemplate: CollectionAfterChangeHook<VehicleTemplate> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating vehicles after template change: ${doc.title}`)

    revalidatePath('/vehicles')
    revalidateTag('vehicles', 'max')
  }

  return doc
}

export const revalidateVehicleTemplateDelete: CollectionAfterDeleteHook<VehicleTemplate> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating vehicles after template delete: ${doc?.title}`)

    revalidatePath('/vehicles')
    revalidateTag('vehicles', 'max')
  }

  return doc
}
