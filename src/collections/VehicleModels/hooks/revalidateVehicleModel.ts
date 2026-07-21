import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Vehicle, VehicleModel } from '@/payload-types'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'

type ParentRef = NonNullable<VehicleModel['vehicle']>[number]

function asParentList(vehicle: VehicleModel['vehicle']): ParentRef[] {
  if (!vehicle) return []
  return Array.isArray(vehicle) ? vehicle : [vehicle as ParentRef]
}

async function resolveParentVehicleSlugs(
  vehicle: VehicleModel['vehicle'],
  payload: Parameters<CollectionAfterChangeHook<VehicleModel>>[0]['req']['payload'],
): Promise<string[]> {
  const parents = asParentList(vehicle)
  const slugs: string[] = []

  for (const parent of parents) {
    if (typeof parent === 'object' && parent?.slug) {
      slugs.push(parent.slug)
      continue
    }

    const vehicleId = typeof parent === 'object' ? parent.id : parent
    if (!vehicleId) continue

    try {
      const doc = (await payload.findByID({
        collection: 'vehicles',
        id: vehicleId,
        depth: 0,
        overrideAccess: false,
        select: { slug: true },
      })) as Pick<Vehicle, 'slug'> | null
      if (doc?.slug) slugs.push(doc.slug)
    } catch {
      // Parent may have been deleted
    }
  }

  return [...new Set(slugs)]
}

function revalidateParentPaths(
  parentSlugs: string[],
  modelSlug: string,
  payload: Parameters<CollectionAfterChangeHook<VehicleModel>>[0]['req']['payload'],
  logPrefix: string,
) {
  for (const parentSlug of parentSlugs) {
    const path = getVehicleModelPath(parentSlug, modelSlug)
    payload.logger.info(`${logPrefix}: ${path}`)
    revalidatePath(path)
    revalidatePath(`/vehicles/${parentSlug}`)
  }
}

export const revalidateVehicleModel: CollectionAfterChangeHook<VehicleModel> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.slug) {
      const parentSlugs = await resolveParentVehicleSlugs(doc.vehicle, payload)
      revalidateParentPaths(parentSlugs, doc.slug, payload, 'Revalidating vehicle model at path')

      revalidateTag('vehicle-models', 'max')
      revalidateTag('vehicles', 'max')
      revalidateTag('sitemap', 'max')
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const parentSlugs = await resolveParentVehicleSlugs(
        previousDoc.vehicle ?? doc.vehicle,
        payload,
      )
      if (previousDoc.slug) {
        revalidateParentPaths(
          parentSlugs,
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
      const parentSlugs = await resolveParentVehicleSlugs(doc.vehicle, payload)
      for (const parentSlug of parentSlugs) {
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
    const parentSlugs = await resolveParentVehicleSlugs(doc?.vehicle, payload)
    if (doc?.slug) {
      revalidateParentPaths(parentSlugs, doc.slug, payload, 'Revalidating deleted vehicle model')
    }

    revalidateTag('vehicle-models', 'max')
    revalidateTag('vehicles', 'max')
    revalidateTag('sitemap', 'max')
  }

  return doc
}
