'use client'

import { useRowLabel } from '@payloadcms/ui'
import {
  labelTruncateStyle,
  previewBlockText,
} from '@/lib/blocks/v2/components/blockLabelText'

export default function IconTextBlockLabel() {
  const { data } = useRowLabel<{ text?: string }>()
  const label = previewBlockText(data?.text) || 'Icon Text'

  return (
    <span style={labelTruncateStyle} title={label}>
      {label}
    </span>
  )
}
