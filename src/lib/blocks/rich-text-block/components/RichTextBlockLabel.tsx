'use client'

import { useRowLabel } from '@payloadcms/ui'
import {
  labelTruncateStyle,
  previewBlockText,
} from '@/lib/blocks/v2/components/blockLabelText'

export default function RichTextBlockLabel() {
  const { data } = useRowLabel<{ content?: unknown }>()
  const label = previewBlockText(data?.content) || 'Rich Text'

  return (
    <span style={labelTruncateStyle} title={label}>
      {label}
    </span>
  )
}
