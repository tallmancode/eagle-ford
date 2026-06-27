'use client'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'

import { richTextConverters } from '@/components/rich-text/richTextConverters'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'

type MessageFieldProps = {
  message?: SerializedEditorState | null
  width?: number | null
}

export function MessageField({ message, width }: MessageFieldProps) {
  if (!message) {
    return null
  }

  return (
    <FieldWrapper width={width}>
      <ConvertRichText converters={richTextConverters} data={message} />
    </FieldWrapper>
  )
}
