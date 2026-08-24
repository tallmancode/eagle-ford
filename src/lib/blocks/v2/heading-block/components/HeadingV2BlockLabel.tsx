'use client'

import { useRowLabel } from '@payloadcms/ui'
import {
  BLOCK_LABEL_MAX_CHARS,
  labelTruncateStyle,
  previewBlockText,
  truncateLabel,
} from '@/lib/blocks/v2/components/blockLabelText'

type NestedTypography = {
  blockType?: string
  text?: string
  label?: string
}

export function HeadingV2BlockLabel() {
  const { data } = useRowLabel<{ content?: NestedTypography[] }>()

  const parts =
    data?.content
      ?.map((block) => previewBlockText(block?.text ?? block?.label, 80))
      .filter((part): part is string => Boolean(part)) ?? []

  const label = parts.length ? truncateLabel(parts.join(' · '), BLOCK_LABEL_MAX_CHARS) : 'Heading'

  return (
    <span style={labelTruncateStyle} title={label}>
      {label}
    </span>
  )
}
