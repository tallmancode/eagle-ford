import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Vehicle, VehicleModel } from '@/payload-types'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'

async function resolveParentVehicleSlug(
  vehicle: VehicleModel['vehicle'],
  payload: Parameters<CollectionAfterChangeHook<VehicleModel>>[0]['req']['payload'],
): Promise<string | null> {
  if (!vehicle) return null

  if (typeof vehicle === 'object' && vehicle?.slug) {
    return vehicle.slug
  }

  const vehicleId = typeof vehicle === 'object' ? vehicle.id : vehicle
  if (!vehicleId) return null

  try {
    const doc = (await payload.findByID({
      collection: 'vehicles',
      id: vehicleId,
      depth: 0,
      overrideAccess: false,
      select: { slug: true },
    })) as Pick<Vehicle, 'slug'> | null
    return doc?.slug ?? null
  } catch {
    return null
  }
}

function revalidateModelPaths(
  vehicleSlug: string | null,
  modelSlug: string,
  payload: Parameters<CollectionAfterChangeHook<VehicleModel>>[0]['req']['payload'],
  logPrefix: string,
) {
  if (!vehicleSlug || !modelSlug) return

  const path = getVehicleModelPath(vehicleSlug, modelSlug)
  payload.logger.info(`${logPrefix}: ${path}`)
  revalidatePath(path)
  revalidatePath(`/vehicles/${vehicleSlug}`)
}

export const revalidateVehicleModel: CollectionAfterChangeHook<VehicleModel> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.slug) {
      const vehicleSlug = await resolveParentVehicleSlug(doc.vehicle, payload)
      revalidateModelPaths(vehicleSlug, doc.slug, payload, 'Revalidating vehicle model at path')

      revalidateTag('vehicle-models', 'max')
      revalidateTag('vehicles', 'max')
      revalidateTag('sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const vehicleSlug = await resolveParentVehicleSlug(
        previousDoc.vehicle ?? doc.vehicle,
        payload,
      )
      if (previousDoc.slug) {
        revalidateModelPaths(
          vehicleSlug,
          previousDoc.slug,
          payload,
          'Revalidating previously published vehicle model',
        )
      }

      revalidateTag('vehicle-models', 'max')
      revalidateTag('vehicles', 'max')
      revalidateTag('sitemap', 'max')
    }

    if (
      doc._status === 'published' &&
      previousDoc?.slug &&
      doc.slug &&
      previousDoc.slug !== doc.slug
    ) {
      const vehicleSlug = await resolveParentVehicleSlug(doc.vehicle, payload)
      if (vehicleSlug) {
        revalidatePath(getVehicleModelPath(vehicleSlug, previousDoc.slug))
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
    const vehicleSlug = await resolveParentVehicleSlug(doc?.vehicle, payload)
    if (doc?.slug) {
      revalidateModelPaths(vehicleSlug, doc.slug, payload, 'Revalidating deleted vehicle model')
    }

    revalidateTag('vehicle-models', 'max')
    revalidateTag('vehicles', 'max')
    revalidateTag('sitemap', 'max')
  }

  return doc
}
