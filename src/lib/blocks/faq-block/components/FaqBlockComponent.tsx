import type { Faq, Media } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { ChevronDown } from 'lucide-react'
import React from 'react'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import { MediaImage } from '@/components/ui/media-image'

export const FaqBlockComponent: React.FC<Faq> = ({ items }) => {
  if (!items || items.length === 0) return null

  return (
    <div className="flex flex-col divide-y divide-border border rounded-2xl overflow-hidden shadow-sm">
      {items.map((item, index) => {
        const image = item.image && typeof item.image === 'object' ? (item.image as Media) : null

        return (
          <details key={item.id ?? index} className="group">
            <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none bg-card hover:bg-muted/50 transition-colors group-open:bg-primary group-open:text-primary-foreground">
              <span className="font-medium">{item.question}</span>
              <ChevronDown className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="px-6 py-5 bg-background text-muted-foreground text-sm leading-relaxed">
              {item.answer && (
                <ConvertRichText
                  converters={richTextConverters}
                  data={item.answer as SerializedEditorState}
                />
              )}
              {image && (
                <div className={item.answer ? 'mt-4' : undefined}>
                  <MediaImage
                    resource={image}
                    alt={item.imageAlt ?? undefined}
                    imgClassName="rounded-lg w-full max-w-md mx-auto h-auto"
                  />
                </div>
              )}
            </div>
          </details>
        )
      })}
    </div>
  )
}
