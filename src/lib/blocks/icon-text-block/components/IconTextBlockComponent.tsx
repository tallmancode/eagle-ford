import type { IconText } from '@/payload-types'
import { colorMap } from '@/lib/blocks/heading-block/templates/heading-template-utils'
import { cn } from '@/utilities/ui'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Car,
  Wrench,
  CheckCircle,
  Info,
  Star,
  Calendar,
  Shield,
  Fuel,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const iconMap: Record<string, LucideIcon> = {
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
  clock: Clock,
  car: Car,
  wrench: Wrench,
  'check-circle': CheckCircle,
  info: Info,
  star: Star,
  calendar: Calendar,
  shield: Shield,
  fuel: Fuel,
}

export const IconTextBlockComponent: React.FC<IconText> = ({
  icon,
  text,
  color = 'default',
  enableLink,
  url,
  newTab,
}) => {
  const Icon = iconMap[icon]
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
