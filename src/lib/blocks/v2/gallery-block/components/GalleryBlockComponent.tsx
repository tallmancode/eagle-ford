import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { GalleryV2Client } from '@/lib/blocks/v2/gallery-block/components/GalleryV2Client'
import type { GalleryV2 } from '@/payload-types'

export function GalleryV2BlockComponent(props: GalleryV2) {
  const { styles, images, columns } = props
  if (!images || images.length === 0) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <GalleryV2Client images={images} columns={columns} />
    </div>
  )
}
