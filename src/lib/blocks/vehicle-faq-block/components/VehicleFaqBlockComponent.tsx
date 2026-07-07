import React from 'react'

import type { VehicleFaqBlock } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleFaq } from './VehicleFaq'

export function VehicleFaqBlockComponent(_props: VehicleFaqBlock & { meta?: BlockRenderMeta }) {
  const vehicle = _props.meta?.vehicle
  if (!vehicle) return null

  const faqs = vehicle.faqs ?? []
  if (faqs.length === 0) return null

  return <VehicleFaq faqs={faqs} />
}
