import React from 'react'

import type { VehicleModelHeroBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModelHero } from './VehicleModelHero'

export function VehicleModelHeroBlockComponent(
  _props: VehicleModelHeroBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  const model = _props.meta?.vehicleModel
  if (!vehicle || !model) return null

  return <VehicleModelHero vehicle={vehicle} model={model} />
}
