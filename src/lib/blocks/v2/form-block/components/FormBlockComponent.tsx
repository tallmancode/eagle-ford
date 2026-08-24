import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { FormBlockComponent } from '@/lib/blocks/form-block/components/FormBlockComponent'
import type { FormBlockMeta } from '@/lib/blocks/form-block/types/formContext'
import type { FormBlockType, FormV2 } from '@/payload-types'

export async function FormV2BlockComponent(props: FormV2 & { meta?: FormBlockMeta }) {
  const { styles, meta, form, enableIntro, introContent } = props
  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <FormBlockComponent
        {...({
          form,
          enableIntro,
          introContent,
          blockType: 'formBlock',
        } as FormBlockType)}
        meta={meta}
      />
    </div>
  )
}
