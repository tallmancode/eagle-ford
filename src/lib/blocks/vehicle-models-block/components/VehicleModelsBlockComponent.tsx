import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { VehicleModelsBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModels } from './VehicleModels'

export async function VehicleModelsBlockComponent(
  _props: VehicleModelsBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null

  const payload = await getPayload({ config: configPromise })
  const modelsResult = await payload.find({
    collection: 'vehicle-models',
    where: { vehicle: { equals: vehicle.id } },
    sort: 'sortOrder',
    depth: 1,
    draft: false,
    overrideAccess: false,
    pagination: false,
  })

  if (modelsResult.docs.length === 0) return null

  return <VehicleModels vehicle={vehicle} models={modelsResult.docs} />
}
