import type { CtaButton } from '@/payload-types'
import { Button } from '@/components/ui/button'
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

  if (!url) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  return (
    <div className={wrapperClass}>
      <Button asChild variant={variant ?? 'default'} size={size ?? 'default'}>
        <Link href={url} {...newTabProps}>
          {label}
        </Link>
      </Button>
    </div>
  )
}
