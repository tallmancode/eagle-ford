import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleModelHighlights } from '@/lib/blocks/vehicle-model-highlights-block/components/VehicleModelHighlights'

type VehicleModelHighlightsV2Props = {
  id?: string | null
  heading?: string | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export function VehicleModelHighlightsV2BlockComponent(props: VehicleModelHighlightsV2Props) {
  const { heading, styles, meta } = props
  const model = meta?.vehicleModel
  if (!model) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleModelHighlights model={model} heading={heading} />
    </div>
  )
}
