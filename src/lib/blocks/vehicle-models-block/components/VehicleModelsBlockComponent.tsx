import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { VehicleModelsBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'
import { VehicleModels } from './VehicleModels'

export async function VehicleModelsBlockComponent(
  _props: VehicleModelsBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null

  const payload = await getPayload({ config: configPromise })
  const [modelsResult, variantsResult] = await Promise.all([
    payload.find({
      collection: 'vehicle-models',
      where: { vehicle: { equals: vehicle.id } },
      sort: 'sortOrder',
      depth: 1,
      draft: false,
      overrideAccess: false,
      pagination: false,
    }),
    payload.find({
      collection: 'vehicle-variants',
      where: { 'model.vehicle': { equals: vehicle.id } },
      sort: 'sortOrder',
      depth: 0,
      draft: false,
      overrideAccess: false,
      pagination: false,
      select: {
        id: true,
        price: true,
        model: true,
      },
    }),
  ])

  if (modelsResult.docs.length === 0) return null

  const variantsByModelId = new Map<string, typeof variantsResult.docs>()
  for (const variant of variantsResult.docs) {
    const modelId =
      typeof variant.model === 'object' && variant.model !== null
        ? String(variant.model.id)
        : String(variant.model)
    const list = variantsByModelId.get(modelId) ?? []
    list.push(variant)
    variantsByModelId.set(modelId, list)
  }

  const modelsWithPricing = modelsResult.docs.map((model) => ({
    ...model,
    startingPrice: getModelStartingPrice(variantsByModelId.get(String(model.id)) ?? []),
  }))

  return <VehicleModels vehicle={vehicle} models={modelsWithPricing} />
}
