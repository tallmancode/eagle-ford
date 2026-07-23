import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { VehicleModelVariantsBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModelVariants } from './VehicleModelVariants'

export async function VehicleModelVariantsBlockComponent(
  _props: VehicleModelVariantsBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  const model = _props.meta?.vehicleModel
  if (!vehicle || !model) return null

  const payload = await getPayload({ config: configPromise })
  const variantsResult = await payload.find({
    collection: 'vehicle-variants',
    where: { model: { equals: model.id } },
    sort: 'sortOrder',
    depth: 1,
    draft: false,
    overrideAccess: false,
    pagination: false,
  })

  if (variantsResult.docs.length === 0) return null

  return <VehicleModelVariants vehicle={vehicle} model={model} variants={variantsResult.docs} />
}
