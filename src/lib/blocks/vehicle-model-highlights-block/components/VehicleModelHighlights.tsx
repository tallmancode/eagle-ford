import React from 'react'

import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
import type { VehicleModel } from '@/payload-types'

type VehicleModelHighlightsProps = {
  model: VehicleModel
}

export function VehicleModelHighlights({ model }: VehicleModelHighlightsProps) {
  const description = model.content?.description

  if (!description) {
    return null
  }

  return (
    <section id="overview" className="py-14 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-primary text-3xl font-bold text-center mb-8">Overview</h2>

        <div className="text-muted-foreground leading-relaxed text-center">
          <ConvertRichText
            converters={richTextConverters}
            data={description as SerializedEditorState}
          />
        </div>
      </div>
    </section>
  )
}
