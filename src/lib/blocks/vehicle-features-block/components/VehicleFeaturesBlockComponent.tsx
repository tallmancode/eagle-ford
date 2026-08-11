import React from 'react'

import type { VehicleFeaturesBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import type { Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { VehicleFeatures } from './VehicleFeatures'

export async function VehicleFeaturesBlockComponent(
  _props: VehicleFeaturesBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null

  const features = vehicle.features ?? []
  if (features.length === 0) return null

  const settings = (await getCachedGlobal('settings', 1)) as Setting
  const salesPhone = settings.contactInfo?.phone ?? null

  return <VehicleFeatures features={features} salesPhone={salesPhone} />
}
