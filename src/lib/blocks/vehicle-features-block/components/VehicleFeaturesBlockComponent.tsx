import React from 'react'

import type { VehicleFeaturesBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleFeatures } from './VehicleFeatures'

export function VehicleFeaturesBlockComponent(
  _props: VehicleFeaturesBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null

  const features = vehicle.features ?? []
  if (features.length === 0) return null

  return <VehicleFeatures features={features} />
}
