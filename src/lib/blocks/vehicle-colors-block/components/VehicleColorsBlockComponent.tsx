import React from 'react'

import type { VehicleColorsBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleColors } from './VehicleColors'

export function VehicleColorsBlockComponent(
  _props: VehicleColorsBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null

  return <VehicleColors vehicleName={vehicle.name} colours={vehicle.colours ?? []} />
}
