import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModelVariants } from '@/lib/blocks/vehicle-model-variants-block/components/VehicleModelVariants'

type VehicleModelVariantsV2Props = {
  id?: string | null
  defaultExpanded?: boolean | null
  showPrices?: boolean | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export async function VehicleModelVariantsV2BlockComponent(props: VehicleModelVariantsV2Props) {
  const { defaultExpanded = true, showPrices = true, styles, meta } = props
  const vehicle = meta?.vehicle
  const model = meta?.vehicleModel
  if (!vehicle || !model) return null

  const payload = await getPayload({ config: configPromise })
  const variantsResult = await payload.find({
    collection: 'vehicle-variants',
    where: { model: { equals: model.id } },
    sort: 'sortOrder',
    depth: 1,
    draft: false,
    overrideAccess: false,
    pagination: false,
  })

  if (variantsResult.docs.length === 0) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleModelVariants
        vehicle={vehicle}
        model={model}
        variants={variantsResult.docs}
        showPrices={showPrices ?? true}
        defaultExpanded={defaultExpanded ?? true}
      />
    </div>
  )
}
