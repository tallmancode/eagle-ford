import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import type { SectionV2 } from '@/payload-types'

export function SectionV2BlockComponent(props: SectionV2 & { meta?: BlockRenderMeta }) {
  const { content, styles, meta } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <section
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <RenderBlocks blocks={content} meta={meta} />
    </section>
  )
}
