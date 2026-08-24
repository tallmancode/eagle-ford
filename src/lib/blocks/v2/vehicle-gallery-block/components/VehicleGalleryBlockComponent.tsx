import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { VehicleGallery } from '@/lib/blocks/vehicle-gallery-block/components/VehicleGallery'

type VehicleGalleryV2Props = {
  id?: string | null
  maxImages?: number | null
  autoplayInterval?: number | null
  styles?: StyleValues | null
  meta?: BlockRenderMeta
}

export function VehicleGalleryV2BlockComponent(props: VehicleGalleryV2Props) {
  const { maxImages = 12, styles, meta } = props
  const vehicle = meta?.vehicle
  if (!vehicle) return null

  const gallery = vehicle.gallery ?? []
  if (gallery.length === 0) return null

  const limit = Math.max(1, maxImages ?? 12)
  const slicedGallery = gallery.slice(0, limit)

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <VehicleGallery vehicleName={vehicle.name} gallery={slicedGallery} />
    </div>
  )
}
