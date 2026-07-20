import React from 'react'

import type { VehicleSpecialCategoriesBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { getVehicleSpecialCategories } from '../getVehicleSpecialCategories'
import { VehicleSpecialCategories } from './VehicleSpecialCategories'

export async function VehicleSpecialCategoriesBlockComponent(
  _props: VehicleSpecialCategoriesBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null

  const categories = await getVehicleSpecialCategories(vehicle.id)
  if (categories.length === 0) return null

  return <VehicleSpecialCategories categories={categories} />
}
