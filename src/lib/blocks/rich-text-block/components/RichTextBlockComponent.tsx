import type { RichText } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import { richTextConverters } from '@/components/rich-text/richTextConverters'

export const RichTextBlockComponent: React.FC<RichText> = (props) => {
  const { content } = props

  if (!content) {
    return null
  }

  return <ConvertRichText converters={richTextConverters} data={content as SerializedEditorState} />
}
