import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { RichTextV2 } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'

export function RichTextV2BlockComponent(props: RichTextV2) {
  const { content, styles } = props

  if (!content) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <ConvertRichText converters={richTextConverters} data={content as SerializedEditorState} />
    </div>
  )
}
