import type { IconText } from '@/payload-types'
import { colorMap } from '@/lib/blocks/heading-block/templates/heading-template-utils'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

export const IconTextBlockComponent: React.FC<IconText> = ({
  icon,
  text,
  color = 'default',
  enableLink,
  url,
  newTab,
}) => {
  const Icon = lucideIconMap[icon]
  const resolvedColor = color ?? 'default'
  const colorClass =
    resolvedColor === 'default'
      ? undefined
      : (colorMap[resolvedColor]?.tagPlain ?? colorMap.primary.tagPlain)
  const iconColorClass = resolvedColor === 'default' ? 'text-primary' : colorClass
  const textColorClass = resolvedColor === 'default' ? undefined : colorClass

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}

  const content = (
    <>
      {Icon && <Icon className={cn('size-4 shrink-0', iconColorClass)} />}
      <span className={textColorClass}>{text}</span>
    </>
  )

  if (enableLink && url) {
    return (
      <Link
        href={url}
        className="flex items-center gap-2 hover:opacity-80 transition-colors"
        {...newTabProps}
      >
        {content}
      </Link>
    )
  }

  return <div className="flex items-center gap-2">{content}</div>
}
