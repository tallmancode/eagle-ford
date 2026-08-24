import type { CtaButton } from '@/payload-types'
import { gtmCtaProps } from '@/components/analytics/gtmCtaProps'
import { Button } from '@/components/ui/button'
import { resolveNavHref } from '@/lib/fields/navigation/resolveNavHref'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import React from 'react'

const alignClass: Record<string, string> = {
  left: 'justify-center md:justify-start',
  center: 'justify-center',
  right: 'justify-center md:justify-end',
}

const mobileTapClass: Record<string, string> = {
  sm: 'h-11 px-4 text-base sm:h-9 sm:px-3 sm:text-sm',
  default: 'h-11 px-5 text-base sm:h-10 sm:px-4 sm:text-sm',
  lg: 'h-12 px-8 text-base sm:h-11 sm:text-sm',
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
  trackAsCta,
  meta,
}) => {
  const inRow = (meta as { inRow?: boolean } | undefined)?.inRow === true
  const resolvedSize = size ?? 'default'
  const wrapperClass = inRow ? undefined : cn('flex w-full', alignClass[align ?? 'left'])
  const Icon = icon ? lucideIconMap[icon] : undefined
  const tapClass = mobileTapClass[resolvedSize] ?? mobileTapClass.default
  const trackingProps = gtmCtaProps({
    trackAsCta,
    name: label,
    location: 'cta-button',
  })

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
      <Button asChild variant={variant ?? 'default'} size={resolvedSize} className={tapClass}>
        <a href={`#${anchorId}`} {...trackingProps}>
          {buttonContent}
        </a>
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
    <Button asChild variant={variant ?? 'default'} size={resolvedSize} className={tapClass}>
      <Link href={href} {...newTabProps} {...trackingProps}>
        {buttonContent}
      </Link>
    </Button>,
  )
}
