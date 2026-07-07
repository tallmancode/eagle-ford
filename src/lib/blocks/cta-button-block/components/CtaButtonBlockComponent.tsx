import type { CtaButton } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { resolveNavHref } from '@/lib/fields/navigation/resolveNavHref'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

const alignClass: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const CtaButtonBlockComponent: React.FC<CtaButton & { meta?: unknown }> = ({
  label,
  icon,
  linkType,
  url,
  reference,
  newTab,
  anchorId,
  variant = 'default',
  size = 'default',
  align = 'left',
  meta,
}) => {
  const inRow = (meta as { inRow?: boolean } | undefined)?.inRow === true
  const wrapperClass = inRow ? undefined : cn('flex w-full', alignClass[align ?? 'left'])
  const Icon = icon ? lucideIconMap[icon] : undefined

  const buttonContent = (
    <>
      {Icon ? <Icon /> : null}
      {label}
    </>
  )

  const wrap = (node: React.ReactNode) =>
    wrapperClass ? <div className={wrapperClass}>{node}</div> : node

  if (linkType === 'anchor') {
    return wrap(
      <Button asChild variant={variant ?? 'default'} size={size ?? 'default'}>
        <a href={`#${anchorId}`}>{buttonContent}</a>
      </Button>,
    )
  }

  let href: string | null = null

  if (linkType === 'reference') {
    if (typeof reference?.value !== 'object' || !reference.value.slug) return null
    href = resolveNavHref({ linkType: 'reference', reference })
  } else if (linkType === 'url') {
    if (!url) return null
    href = url
  } else {
    return null
  }

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  return wrap(
    <Button asChild variant={variant ?? 'default'} size={size ?? 'default'}>
      <Link href={href} {...newTabProps}>
        {buttonContent}
      </Link>
    </Button>,
  )
}
