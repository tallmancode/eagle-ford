import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { MapBlockComponent } from '@/lib/blocks/map-block/components/MapBlockComponent'
import type { Map, MapV2 } from '@/payload-types'

export function MapV2BlockComponent(props: MapV2) {
  const { styles, embedUrl, title } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <MapBlockComponent
        {...({
          embedUrl,
          title,
          blockType: 'map',
        } as Map)}
      />
    </div>
  )
}
