import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModels } from '@/lib/blocks/vehicle-models-block/components/VehicleModels'
import { getModelStartingPrice } from '@/lib/utils/vehicleModel'

type VehicleModelsV2Props = {
  id?: string | null
  heading?: string | null
  layout?: 'grid' | 'accordion' | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export async function VehicleModelsV2BlockComponent(props: VehicleModelsV2Props) {
  const { heading, styles, meta } = props
  const vehicle = meta?.vehicle
  if (!vehicle) return null

  const payload = await getPayload({ config: configPromise })
  const [modelsResult, variantsResult] = await Promise.all([
    payload.find({
      collection: 'vehicle-models',
      where: { vehicle: { equals: vehicle.id } },
      sort: 'sortOrder',
      depth: 1,
      draft: false,
      overrideAccess: false,
      pagination: false,
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

  if (modelsResult.docs.length === 0) return null

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
      <VehicleModels vehicle={vehicle} models={modelsWithPricing} heading={heading} />
    </div>
  )
}
