import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModelHero } from '@/lib/blocks/vehicle-model-hero-block/components/VehicleModelHero'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'

type VehicleModelHeroV2Props = {
  id?: string | null
  showPrice?: boolean | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export async function VehicleModelHeroV2BlockComponent(props: VehicleModelHeroV2Props) {
  const { showPrice = true, styles, meta } = props
  const vehicle = meta?.vehicle
  const model = meta?.vehicleModel
  if (!vehicle || !model) return null

  let startingPrice: number | null = null
  if (showPrice ?? true) {
    const payload = await getPayload({ config: configPromise })
    const variantsResult = await payload.find({
      collection: 'vehicle-variants',
      where: { model: { equals: model.id } },
      sort: 'sortOrder',
      depth: 0,
      draft: false,
      overrideAccess: false,
      pagination: false,
      select: { price: true },
    })
    startingPrice = getModelStartingPrice(variantsResult.docs)
  }

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleModelHero vehicle={vehicle} model={model} startingPrice={startingPrice} />
    </div>
  )
}
