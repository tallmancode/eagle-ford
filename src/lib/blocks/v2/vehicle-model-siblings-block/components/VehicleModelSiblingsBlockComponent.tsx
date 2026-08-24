import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModelSiblings } from '@/lib/blocks/vehicle-model-siblings-block/components/VehicleModelSiblings'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'

type VehicleModelSiblingsV2Props = {
  id?: string | null
  heading?: string | null
  pageSize?: number | null
  includeCurrent?: boolean | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export async function VehicleModelSiblingsV2BlockComponent(props: VehicleModelSiblingsV2Props) {
  const { heading, pageSize = 3, includeCurrent = false, styles, meta } = props
  const vehicle = meta?.vehicle
  const currentModel = meta?.vehicleModel
  if (!vehicle || !currentModel) return null

  const payload = await getPayload({ config: configPromise })
  const [modelsResult, variantsResult] = await Promise.all([
    payload.find({
      collection: 'vehicle-models',
      draft: false,
      depth: 1,
      sort: 'sortOrder',
      overrideAccess: false,
      pagination: false,
      where: { vehicle: { equals: vehicle.id } },
    }),
    payload.find({
      collection: 'vehicle-variants',
      where: { 'model.vehicle': { equals: vehicle.id } },
      sort: 'sortOrder',
      depth: 0,
      draft: false,
      overrideAccess: false,
      pagination: false,
      select: {
        id: true,
        price: true,
        model: true,
      },
    }),
  ])

  const variantsByModelId = new Map<string, typeof variantsResult.docs>()
  for (const variant of variantsResult.docs) {
    const modelId =
      typeof variant.model === 'object' && variant.model !== null
        ? String(variant.model.id)
        : String(variant.model)
    const list = variantsByModelId.get(modelId) ?? []
    list.push(variant)
    variantsByModelId.set(modelId, list)
  }

  const modelsWithPricing = modelsResult.docs.map((model) => ({
    ...model,
    startingPrice: getModelStartingPrice(variantsByModelId.get(String(model.id)) ?? []),
  }))

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleModelSiblings
        vehicle={vehicle}
        currentModel={currentModel}
        models={modelsWithPricing}
        heading={heading}
        pageSize={pageSize}
        includeCurrent={includeCurrent ?? false}
      />
    </div>
  )
}
