import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { VehicleModelSiblingsBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'
import { VehicleModelSiblings } from './VehicleModelSiblings'

export async function VehicleModelSiblingsBlockComponent(
  _props: VehicleModelSiblingsBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  const currentModel = _props.meta?.vehicleModel
  if (!vehicle || !currentModel) return null

  const payload = await getPayload({ config: configPromise })
  const [modelsResult, variantsResult] = await Promise.all([
    payload.find({
      collection: 'vehicle-models',
      draft: false,
      depth: 1,
      sort: 'sortOrder',
      overrideAccess: false,
      pagination: false,
      where: { vehicle: { equals: vehicle.id } },
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

  return (
    <VehicleModelSiblings
      vehicle={vehicle}
      currentModel={currentModel}
      models={modelsWithPricing}
    />
  )
}
