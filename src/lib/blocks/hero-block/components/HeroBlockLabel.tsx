'use client'

import { useRowLabel } from '@payloadcms/ui'
import { heroOptions } from '@/lib/blocks/hero-block/heroOptions'

const getTemplateLabel = (value?: string) =>
  heroOptions.find((option) => option.value === value)?.label

export default function HeroBlockLabel() {
  const { data } = useRowLabel<{ template?: string }>()
  const templateLabel = getTemplateLabel(data?.template)

  return <span>Hero - {templateLabel ?? 'Unlabelled'}</span>
}
