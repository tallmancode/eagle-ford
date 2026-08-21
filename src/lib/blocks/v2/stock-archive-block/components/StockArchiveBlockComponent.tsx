import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { StockArchiveBlockComponent } from '@/lib/blocks/stock-archive-block/components/StockArchiveBlockComponent'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import type { StockArchive, StockArchiveV2 } from '@/payload-types'

export async function StockArchiveV2BlockComponent(
  props: StockArchiveV2 & { meta?: BlockRenderMeta },
) {
  const { styles, meta, conditionFilter, limit, showPagination } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <StockArchiveBlockComponent
        {...({
          conditionFilter,
          limit,
          showPagination,
          blockType: 'stock-archive',
        } as StockArchive)}
        meta={meta}
      />
    </div>
  )
}
