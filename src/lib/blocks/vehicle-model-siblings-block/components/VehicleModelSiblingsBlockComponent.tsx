import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { VehicleModelSiblingsBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModelSiblings } from './VehicleModelSiblings'

export async function VehicleModelSiblingsBlockComponent(
  _props: VehicleModelSiblingsBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  const currentModel = _props.meta?.vehicleModel
  if (!vehicle || !currentModel) return null

  const payload = await getPayload({ config: configPromise })
  const modelsResult = await payload.find({
    collection: 'vehicle-models',
    draft: false,
    depth: 1,
    sort: 'sortOrder',
    overrideAccess: false,
    pagination: false,
    where: { vehicle: { equals: vehicle.id } },
  })

  return (
    <VehicleModelSiblings
      vehicle={vehicle}
      currentModel={currentModel}
      models={modelsResult.docs}
    />
  )
}
