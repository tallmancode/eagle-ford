import React from 'react'

import type { VehicleModelHighlightsBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModelHighlights } from './VehicleModelHighlights'

export function VehicleModelHighlightsBlockComponent(
  _props: VehicleModelHighlightsBlock & { meta?: BlockRenderMeta },
) {
  const model = _props.meta?.vehicleModel
  if (!model) return null

  return <VehicleModelHighlights model={model} />
}
