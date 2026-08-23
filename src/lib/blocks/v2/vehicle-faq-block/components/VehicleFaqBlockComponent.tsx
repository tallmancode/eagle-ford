import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleFaq } from '@/lib/blocks/vehicle-faq-block/components/VehicleFaq'

type VehicleFaqV2Props = {
  id?: string | null
  heading?: string | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export function VehicleFaqV2BlockComponent(props: VehicleFaqV2Props) {
  const { heading, styles, meta } = props
  const vehicle = meta?.vehicle
  if (!vehicle) return null

  const faqs = vehicle.faqs ?? []
  if (faqs.length === 0) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleFaq faqs={faqs} heading={heading} />
    </div>
  )
}
