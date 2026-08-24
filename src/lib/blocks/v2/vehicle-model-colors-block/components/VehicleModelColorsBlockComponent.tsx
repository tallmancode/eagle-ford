import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleColors } from '@/lib/blocks/vehicle-colors-block/components/VehicleColors'
import { getModelColours } from '@/lib/utils/vehicleModel'

type VehicleModelColorsV2Props = {
  id?: string | null
  heading?: string | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export function VehicleModelColorsV2BlockComponent(props: VehicleModelColorsV2Props) {
  const { heading, styles, meta } = props
  const vehicle = meta?.vehicle
  const model = meta?.vehicleModel
  if (!model) return null

  const colours = getModelColours(model, vehicle)
  if (colours.length === 0) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleColors vehicleName={model.name} colours={colours} heading={heading} />
    </div>
  )
}
