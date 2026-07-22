import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { VehicleModelHeroBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'
import { VehicleModelHero } from './VehicleModelHero'

export async function VehicleModelHeroBlockComponent(
  _props: VehicleModelHeroBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  const model = _props.meta?.vehicleModel
  if (!vehicle || !model) return null

  const payload = await getPayload({ config: configPromise })
  const variantsResult = await payload.find({
    collection: 'vehicle-variants',
    where: { model: { equals: model.id } },
    sort: 'sortOrder',
    depth: 0,
    draft: false,
    overrideAccess: false,
    pagination: false,
    select: { price: true },
  })

  const startingPrice = getModelStartingPrice(variantsResult.docs)

  return <VehicleModelHero vehicle={vehicle} model={model} startingPrice={startingPrice} />
}
