import type { CtaButton } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { resolveNavHref } from '@/lib/fields/navigation/resolveNavHref'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

const alignClass: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const CtaButtonBlockComponent: React.FC<CtaButton> = ({
  label,
  linkType,
  url,
  reference,
  newTab,
  anchorId,
  variant = 'default',
  size = 'default',
  align = 'left',
}) => {
  const wrapperClass = cn('flex w-full', alignClass[align ?? 'left'])

  if (linkType === 'anchor') {
    return (
      <div className={wrapperClass}>
        <Button asChild variant={variant ?? 'default'} size={size ?? 'default'}>
          <a href={`#${anchorId}`}>{label}</a>
        </Button>
      </div>
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

  return (
    <div className={wrapperClass}>
      <Button asChild variant={variant ?? 'default'} size={size ?? 'default'}>
        <Link href={href} {...newTabProps}>
          {label}
        </Link>
      </Button>
    </div>
  )
}
