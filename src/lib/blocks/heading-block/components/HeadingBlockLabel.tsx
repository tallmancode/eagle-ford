'use client'

import { useRowLabel } from '@payloadcms/ui'
import { headingOptions } from '@/lib/blocks/heading-block/headingOptions'

const getTemplateLabel = (value?: string) =>
  headingOptions.find((option) => option.value === value)?.label

const truncate = (str?: string | null, max = 20) =>
  str && str.length > max ? str.slice(0, max) + '…' : str

export default function HeadingBlockLabel() {
  const { data } = useRowLabel<{
    template?: string
    standardHeadingContent?: {
      heading?: string
    }
    swipeHeadingContent?: {
      heading?: string
    }
    // Legacy flat fields (pre-migration)
    heading?: string
  }>()

  const templateLabel = getTemplateLabel(data?.template)
  const headingText =
    data?.standardHeadingContent?.heading ?? data?.swipeHeadingContent?.heading ?? data?.heading

  return (
    <span>
      Heading - {templateLabel ?? 'Unlabelled'}
      {headingText ? ` · ${truncate(headingText)}` : ''}
    </span>
  )
}
