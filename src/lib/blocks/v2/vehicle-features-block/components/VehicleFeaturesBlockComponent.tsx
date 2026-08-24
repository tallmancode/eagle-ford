import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleFeatures } from '@/lib/blocks/vehicle-features-block/components/VehicleFeatures'
import type { Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/utils/getGlobals'

type VehicleFeaturesV2Props = {
  id?: string | null
  maxFeatures?: number | null
  showCallCta?: boolean | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export async function VehicleFeaturesV2BlockComponent(props: VehicleFeaturesV2Props) {
  const { maxFeatures, showCallCta = true, styles, meta } = props
  const vehicle = meta?.vehicle
  if (!vehicle) return null

  const features = vehicle.features ?? []
  if (features.length === 0) return null

  const slicedFeatures =
    maxFeatures != null && maxFeatures > 0 ? features.slice(0, maxFeatures) : features

  let salesPhone: string | null = null
  if (showCallCta ?? true) {
    const settings = (await getCachedGlobal('settings', 1)) as Setting
    salesPhone = settings.contactInfo?.phone ?? null
  }

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleFeatures features={slicedFeatures} salesPhone={salesPhone} />
    </div>
  )
}
