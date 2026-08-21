import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { FaqBlockComponent } from '@/lib/blocks/faq-block/components/FaqBlockComponent'
import type { Faq, FaqV2 } from '@/payload-types'

export function FaqV2BlockComponent(props: FaqV2) {
  const { styles, items } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <FaqBlockComponent
        {...({
          items,
          blockType: 'faq',
        } as Faq)}
      />
    </div>
  )
}
