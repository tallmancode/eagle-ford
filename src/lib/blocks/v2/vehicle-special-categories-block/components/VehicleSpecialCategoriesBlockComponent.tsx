import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { getVehicleSpecialCategories } from '@/lib/blocks/vehicle-special-categories-block/getVehicleSpecialCategories'
import { VehicleSpecialCategories } from '@/lib/blocks/vehicle-special-categories-block/components/VehicleSpecialCategories'

type VehicleSpecialCategoriesV2Props = {
  id?: string | null
  heading?: string | null
  emptyStateCopy?: string | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export async function VehicleSpecialCategoriesV2BlockComponent(
  props: VehicleSpecialCategoriesV2Props,
) {
  const { heading, emptyStateCopy, styles, meta } = props
  const vehicle = meta?.vehicle
  if (!vehicle) return null

  const categories = await getVehicleSpecialCategories(vehicle.id)
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {heading?.trim() ? (
        <h2 className="mb-6 text-center text-3xl font-bold text-primary">{heading.trim()}</h2>
      ) : null}
      {categories.length === 0 ? (
        emptyStateCopy?.trim() ? (
          <p className="px-4 text-center text-muted-foreground">{emptyStateCopy.trim()}</p>
        ) : null
      ) : (
        <VehicleSpecialCategories categories={categories} />
      )}
    </div>
  )
}
