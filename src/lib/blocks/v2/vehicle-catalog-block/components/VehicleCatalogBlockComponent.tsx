import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { VehicleCatalogBlockComponent } from '@/lib/blocks/vehicle-catalog-block/components/VehicleCatalogBlockComponent'
import type { VehicleCatalogBlock, VehicleCatalogV2 } from '@/payload-types'

export async function VehicleCatalogV2BlockComponent(props: VehicleCatalogV2) {
  const { styles, heading } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleCatalogBlockComponent
        {...({
          heading,
          blockType: 'vehicle-catalog',
        } as VehicleCatalogBlock)}
      />
    </div>
  )
}
