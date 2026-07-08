import React from 'react'

import type { VehicleGalleryBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleGallery } from './VehicleGallery'

export function VehicleGalleryBlockComponent(
  _props: VehicleGalleryBlock & { meta?: BlockRenderMeta },
) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null

  const gallery = vehicle.gallery ?? []
  if (gallery.length === 0) return null

  return <VehicleGallery vehicleName={vehicle.name} gallery={gallery} />
}
