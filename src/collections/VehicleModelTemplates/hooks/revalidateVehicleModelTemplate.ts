import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { VehicleModelTemplate } from '@/payload-types'

export const revalidateVehicleModelTemplate: CollectionAfterChangeHook<VehicleModelTemplate> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating vehicles after model template change: ${doc.title}`)

    revalidatePath('/vehicles')
    revalidateTag('vehicles', 'max')
    revalidateTag('vehicle-models', 'max')
  }

  return doc
}

export const revalidateVehicleModelTemplateDelete: CollectionAfterDeleteHook<
  VehicleModelTemplate
> = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating vehicles after model template delete: ${doc?.title}`)

    revalidatePath('/vehicles')
    revalidateTag('vehicles', 'max')
    revalidateTag('vehicle-models', 'max')
  }

  return doc
}
