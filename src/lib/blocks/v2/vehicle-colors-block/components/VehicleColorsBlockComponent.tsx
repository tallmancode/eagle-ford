import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleColors } from '@/lib/blocks/vehicle-colors-block/components/VehicleColors'

type VehicleColorsV2Props = {
  id?: string | null
  heading?: string | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export function VehicleColorsV2BlockComponent(props: VehicleColorsV2Props) {
  const { heading, styles, meta } = props
  const vehicle = meta?.vehicle
  if (!vehicle) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleColors
        vehicleName={vehicle.name}
        colours={vehicle.colours ?? []}
        heading={heading}
      />
    </div>
  )
}
