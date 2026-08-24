import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { SpecialsArchiveBlockComponent } from '@/lib/blocks/specials-archive-block/components/SpecialsArchiveBlockComponent'
import type { SpecialsArchive, SpecialsArchiveV2 } from '@/payload-types'

export async function SpecialsArchiveV2BlockComponent(props: SpecialsArchiveV2) {
  const { styles } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <SpecialsArchiveBlockComponent
        {...({
          blockType: 'specials-archive',
        } as SpecialsArchive)}
      />
    </div>
  )
}
