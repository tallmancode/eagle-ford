import React from 'react'

import type { VehicleHeroBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleHero } from './VehicleHero'

export function VehicleHeroBlockComponent(_props: VehicleHeroBlock & { meta?: BlockRenderMeta }) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null
  return <VehicleHero vehicle={vehicle} />
}
