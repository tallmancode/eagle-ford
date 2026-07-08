import React from 'react'

import type { VehicleModelColorsBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleColors } from '@/lib/blocks/vehicle-colors-block/components/VehicleColors'
import { getModelColours } from '@/lib/utils/vehicleModel'

export function VehicleModelColorsBlockComponent(
  _props: VehicleModelColorsBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  const model = _props.meta?.vehicleModel
  if (!model) return null

  const colours = getModelColours(model, vehicle)
  if (colours.length === 0) return null

  return <VehicleColors vehicleName={model.name} colours={colours} />
}
