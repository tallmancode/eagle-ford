import type { IconText } from '@/payload-types'
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

export const IconTextBlockComponent: React.FC<IconText> = ({ icon, text }) => {
  const Icon = iconMap[icon]

  return (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="size-4 shrink-0 text-primary" />}
      <span>{text}</span>
    </div>
  )
}
