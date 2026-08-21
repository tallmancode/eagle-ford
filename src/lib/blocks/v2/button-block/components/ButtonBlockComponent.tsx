import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { CtaButtonBlockComponent } from '@/lib/blocks/cta-button-block/components/CtaButtonBlockComponent'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import type { ButtonV2, CtaButton } from '@/payload-types'

export function ButtonV2BlockComponent(props: ButtonV2 & { meta?: BlockRenderMeta }) {
  const { styles, meta, ...ctaProps } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <CtaButtonBlockComponent
        {...(ctaProps as unknown as CtaButton)}
        blockType="cta-button"
        meta={meta}
      />
    </div>
  )
}
