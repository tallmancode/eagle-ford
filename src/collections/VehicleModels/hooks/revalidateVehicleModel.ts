import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { VehicleModel } from '@/payload-types'

export const revalidateVehicleModel: CollectionAfterChangeHook<VehicleModel> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating vehicle model: ${doc.slug}`)

      revalidateTag('vehicle-models', 'max')
      revalidateTag('vehicles', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      revalidateTag('vehicle-models', 'max')
      revalidateTag('vehicles', 'max')
    }
  }

  return doc
}

export const revalidateVehicleModelDelete: CollectionAfterDeleteHook<VehicleModel> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    revalidateTag('vehicle-models', 'max')
    revalidateTag('vehicles', 'max')
  }

  return doc
}
