import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Vehicle, VehicleModel, VehicleVariant } from '@/payload-types'
import { getVehicleModelPath } from '@/lib/utils/vehicleModel'

async function resolveModelContext(
  modelRef: VehicleVariant['model'],
  payload: Parameters<CollectionAfterChangeHook<VehicleVariant>>[0]['req']['payload'],
): Promise<{ modelSlug: string; vehicleSlug: string } | null> {
  if (!modelRef) return null

  let model: Pick<VehicleModel, 'slug' | 'vehicle'> | null =
    typeof modelRef === 'object' && modelRef !== null
      ? { slug: modelRef.slug, vehicle: modelRef.vehicle }
      : null

  if (!model?.slug) {
    const modelId = typeof modelRef === 'object' ? modelRef.id : modelRef
    if (!modelId) return null

    try {
      model = (await payload.findByID({
        collection: 'vehicle-models',
        id: modelId,
        depth: 1,
        overrideAccess: false,
        select: { slug: true, vehicle: true },
      })) as Pick<VehicleModel, 'slug' | 'vehicle'> | null
    } catch {
      return null
    }
  }

  if (!model?.slug) return null

  const vehicleRef = model.vehicle
  if (!vehicleRef) return null

  if (typeof vehicleRef === 'object' && vehicleRef?.slug) {
    return { modelSlug: model.slug, vehicleSlug: vehicleRef.slug }
  }

  const vehicleId = typeof vehicleRef === 'object' ? vehicleRef.id : vehicleRef
  if (!vehicleId) return null

  try {
    const vehicle = (await payload.findByID({
      collection: 'vehicles',
      id: vehicleId,
      depth: 0,
      overrideAccess: false,
      select: { slug: true },
    })) as Pick<Vehicle, 'slug'> | null
    if (!vehicle?.slug) return null
    return { modelSlug: model.slug, vehicleSlug: vehicle.slug }
  } catch {
    return null
  }
}

function revalidateVariantPaths(
  context: { modelSlug: string; vehicleSlug: string } | null,
  payload: Parameters<CollectionAfterChangeHook<VehicleVariant>>[0]['req']['payload'],
  logPrefix: string,
) {
  if (!context) return

  const path = getVehicleModelPath(context.vehicleSlug, context.modelSlug)
  payload.logger.info(`${logPrefix}: ${path}`)
  revalidatePath(path)
  revalidatePath(`/vehicles/${context.vehicleSlug}`)
}

export const revalidateVehicleVariant: CollectionAfterChangeHook<VehicleVariant> = async ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const modelContext = await resolveModelContext(doc.model, payload)
    revalidateVariantPaths(modelContext, payload, 'Revalidating parent model page for variant')

    revalidateTag('vehicle-variants', 'max')
    revalidateTag('vehicle-models', 'max')
    revalidateTag('vehicles', 'max')
    revalidateTag('sitemap', 'max')

    if (previousDoc?.model && previousDoc.model !== doc.model) {
      const previousContext = await resolveModelContext(previousDoc.model, payload)
      revalidateVariantPaths(previousContext, payload, 'Revalidating previous parent model page')
    }
  }

  return doc
}

export const revalidateVehicleVariantDelete: CollectionAfterDeleteHook<VehicleVariant> = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const modelContext = await resolveModelContext(doc?.model, payload)
    revalidateVariantPaths(modelContext, payload, 'Revalidating parent model after variant delete')

    revalidateTag('vehicle-variants', 'max')
    revalidateTag('vehicle-models', 'max')
    revalidateTag('vehicles', 'max')
    revalidateTag('sitemap', 'max')
  }

  return doc
}
