import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { AccordionV2 } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { ChevronDown } from 'lucide-react'

export function AccordionV2BlockComponent(props: AccordionV2) {
  const { items, styles } = props

  if (!items || items.length === 0) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={[
        'flex flex-col divide-y divide-border overflow-hidden rounded-2xl border shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {items.map((item, index) => (
        <details key={item.id ?? index} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-card px-6 py-4 transition-colors hover:bg-primary/10 group-open:bg-primary group-open:text-primary-foreground">
            <span className="font-medium">{item.title}</span>
            <ChevronDown className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <div className="bg-background px-6 py-5 text-sm leading-relaxed text-muted-foreground">
            {item.content ? (
              <ConvertRichText
                converters={richTextConverters}
                data={item.content as SerializedEditorState}
              />
            ) : null}
          </div>
        </details>
      ))}
    </div>
  )
}
