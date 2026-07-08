import React from 'react'

import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { VehicleModel } from '@/payload-types'

type VehicleModelHighlightsProps = {
  model: VehicleModel
}

export function VehicleModelHighlights({ model }: VehicleModelHighlightsProps) {
  const highlights = model.highlights ?? []
  const description = model.content?.description

  if (highlights.length === 0 && !description) {
    return null
  }

  return (
    <section id="overview" className="py-14 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-primary text-3xl font-bold text-center mb-8">Overview</h2>

        {description && (
          <div className="text-muted-foreground leading-relaxed mb-10 text-center">
            <ConvertRichText
              converters={richTextConverters}
              data={description as SerializedEditorState}
            />
          </div>
        )}

        {highlights.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <li
                key={item.id ?? i}
                className="flex items-start gap-3 bg-muted/40 rounded-xl px-5 py-4 text-sm text-muted-foreground"
              >
                <span className="text-primary mt-0.5 shrink-0 font-bold">•</span>
                <span>{item.highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
