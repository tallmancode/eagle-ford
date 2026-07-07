'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function NavLinkRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    label?: string
    type?: string
  }>()

  const typeLabel =
    data?.type === 'vehicleMegaMenu'
      ? 'Vehicle Mega Menu'
      : data?.type === 'dropdown'
        ? 'Dropdown'
        : 'Link'

  return (
    <span>
      {typeLabel} {(rowNumber ?? 0) + 1} - {data?.label?.trim() ? data.label : 'Unlabelled'}
    </span>
  )
}
