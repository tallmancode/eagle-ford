'use client'

import { useRowLabel } from '@payloadcms/ui'

const formatBlockName = (blockType?: string) => {
  if (!blockType) return undefined
  const parts = blockType.split(/[-_]/).filter(Boolean)
  if (!parts.length) return undefined

  const title = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')

  return title.endsWith('Block') ? `${title}` : `${title} Block`
}

export default function SectionBlockLabel() {
  const { data } = useRowLabel<{
    content?: { blockType?: string }[]
  }>()
  const blockNames =
    data?.content
      ?.map((block) => formatBlockName(block?.blockType))
      .filter((name): name is string => Boolean(name)) ?? []

  return <span>{blockNames.length ? blockNames.join(' - ') : 'Section'}</span>
}
