import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { RenderBlocks } from '@/lib/blocks/RenderBlocks'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { cn } from '@/lib/utils/cn'
import type { ButtonGroupV2 } from '@/payload-types'

export function ButtonGroupV2BlockComponent(props: ButtonGroupV2 & { meta?: BlockRenderMeta }) {
  const { content, styles, meta } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  if (!Array.isArray(content) || content.length === 0) return null

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3',
        '[&>div]:w-auto [&>div]:shrink-0',
        '[&>div>div]:!w-auto [&>div>div]:justify-start',
        className,
      )}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <RenderBlocks blocks={content} meta={meta} />
    </div>
  )
}
