import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleHero } from '@/lib/blocks/vehicle-hero-block/components/VehicleHero'

type VehicleHeroV2Props = {
  id?: string | null
  showPrice?: boolean | null
  showBadge?: boolean | null
  showBrochure?: boolean | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export function VehicleHeroV2BlockComponent(props: VehicleHeroV2Props) {
  const { showPrice = true, showBadge = true, showBrochure = true, styles, meta } = props
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
      <VehicleHero
        vehicle={vehicle}
        showPrice={showPrice ?? true}
        showBadge={showBadge ?? true}
        showBrochure={showBrochure ?? true}
      />
    </div>
  )
}
