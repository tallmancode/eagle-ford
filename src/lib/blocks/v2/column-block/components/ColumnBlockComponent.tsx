import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import type { ColumnV2 } from '@/payload-types'

export function ColumnV2BlockComponent(props: ColumnV2 & { meta?: BlockRenderMeta }) {
  const { content, styles, meta } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <RenderBlocks blocks={content} meta={meta} />
    </div>
  )
}
