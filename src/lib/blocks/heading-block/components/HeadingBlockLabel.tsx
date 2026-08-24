'use client'

import { useRowLabel } from '@payloadcms/ui'
import {
  labelTruncateStyle,
  previewBlockText,
} from '@/lib/blocks/v2/components/blockLabelText'
import { headingOptions } from '@/lib/blocks/heading-block/headingOptions'

const getTemplateLabel = (value?: string) =>
  headingOptions.find((option) => option.value === value)?.label

export default function HeadingBlockLabel() {
  const { data } = useRowLabel<{
    template?: string
    standardHeadingContent?: {
      heading?: string
    }
    swipeHeadingContent?: {
      heading?: string
    }
    dashHeadingContent?: {
      heading?: string
    }
    separatorHeadingContent?: {
      heading?: string
    }
    heading?: string
  }>()

  const headingText =
    previewBlockText(
      data?.standardHeadingContent?.heading ??
        data?.swipeHeadingContent?.heading ??
        data?.dashHeadingContent?.heading ??
        data?.separatorHeadingContent?.heading ??
        data?.heading,
    ) ?? undefined

  const label = headingText || getTemplateLabel(data?.template) || 'Heading'

  return (
    <span style={labelTruncateStyle} title={label}>
      {label}
    </span>
  )
}
