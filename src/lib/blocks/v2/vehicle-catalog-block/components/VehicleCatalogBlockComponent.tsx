import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { VehicleCatalogBlockComponent } from '@/lib/blocks/vehicle-catalog-block/components/VehicleCatalogBlockComponent'
import type { VehicleCatalogBlock, VehicleCatalogV2 } from '@/payload-types'

export async function VehicleCatalogV2BlockComponent(props: VehicleCatalogV2) {
  const { styles, cardBackgroundColor } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })
  const cardBackgroundCss = resolveColorCss(cardBackgroundColor)

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleCatalogBlockComponent
        {...({
          blockType: 'vehicle-catalog',
          cardBackgroundCss,
        } as VehicleCatalogBlock & { cardBackgroundCss?: string })}
      />
    </div>
  )
}
