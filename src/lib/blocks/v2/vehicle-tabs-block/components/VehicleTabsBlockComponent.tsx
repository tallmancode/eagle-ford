import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { resolveColorCss } from '@/lib/blocks/v2/apply/color'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { VehicleTabsBlockComponent } from '@/lib/blocks/vehicle-tabs-block/components/VehicleTabsBlockComponent'
import type { VehicleTabsBlock, VehicleTabsV2 } from '@/payload-types'

export async function VehicleTabsV2BlockComponent(props: VehicleTabsV2) {
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
      <VehicleTabsBlockComponent
        {...({
          blockType: 'vehicle-tabs',
          cardBackgroundCss,
        } as VehicleTabsBlock & { cardBackgroundCss?: string })}
      />
    </div>
  )
}
