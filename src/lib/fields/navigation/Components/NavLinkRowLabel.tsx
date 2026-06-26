'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function NavLinkRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    label: string
  }>()
  return (
    <span>
      Link {(rowNumber ?? 0) + 1} - {data?.label?.trim() ? data.label : 'Unlabelled'}
    </span>
  )
}
