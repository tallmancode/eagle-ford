import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Vehicle, VehicleModel } from '@/payload-types'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'

async function resolveParentVehicleSlug(
  vehicle: VehicleModel['vehicle'],
  payload: Parameters<CollectionAfterChangeHook<VehicleModel>>[0]['req']['payload'],
): Promise<string | null> {
  if (!vehicle) return null
  if (typeof vehicle === 'object' && vehicle.slug) return vehicle.slug

  const vehicleId = typeof vehicle === 'object' ? vehicle.id : vehicle
  try {
    const parent = (await payload.findByID({
      collection: 'vehicles',
      id: vehicleId,
      depth: 0,
      overrideAccess: false,
      select: { slug: true },
    })) as Pick<Vehicle, 'slug'> | null
    return parent?.slug ?? null
  } catch {
    return null
  }
}

export const revalidateVehicleModel: CollectionAfterChangeHook<VehicleModel> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.slug) {
      const parentSlug = await resolveParentVehicleSlug(doc.vehicle, payload)
      if (parentSlug) {
        const path = getVehicleModelPath(parentSlug, doc.slug)
        payload.logger.info(`Revalidating vehicle model at path: ${path}`)
        revalidatePath(path)
        revalidatePath(`/vehicles/${parentSlug}`)
      }

      revalidateTag('vehicle-models', 'max')
      revalidateTag('vehicles', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const parentSlug = await resolveParentVehicleSlug(previousDoc.vehicle ?? doc.vehicle, payload)
      if (parentSlug && previousDoc.slug) {
        const path = getVehicleModelPath(parentSlug, previousDoc.slug)
        payload.logger.info(`Revalidating previously published vehicle model: ${path}`)
        revalidatePath(path)
        revalidatePath(`/vehicles/${parentSlug}`)
      }

      revalidateTag('vehicle-models', 'max')
      revalidateTag('vehicles', 'max')
    }

    if (
      doc._status === 'published' &&
      previousDoc?.slug &&
      doc.slug &&
      previousDoc.slug !== doc.slug
    ) {
      const parentSlug = await resolveParentVehicleSlug(doc.vehicle, payload)
      if (parentSlug) {
        revalidatePath(getVehicleModelPath(parentSlug, previousDoc.slug))
      }
    }
  }

  return doc
}

export const revalidateVehicleModelDelete: CollectionAfterDeleteHook<VehicleModel> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const parentSlug = await resolveParentVehicleSlug(doc?.vehicle, payload)
    if (parentSlug && doc?.slug) {
      revalidatePath(getVehicleModelPath(parentSlug, doc.slug))
      revalidatePath(`/vehicles/${parentSlug}`)
    }

    revalidateTag('vehicle-models', 'max')
    revalidateTag('vehicles', 'max')
  }

  return doc
}
