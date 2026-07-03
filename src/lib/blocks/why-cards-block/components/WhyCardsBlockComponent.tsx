import type { WhyCards } from '@/payload-types'
import {
  TrendingUp,
  ShieldCheck,
  Handshake,
  CheckCircle,
  Star,
  Shield,
  Car,
  Wrench,
  Info,
  Calendar,
  Fuel,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Zap,
  Heart,
  ThumbsUp,
  DollarSign,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import React from 'react'

const iconMap: Record<string, LucideIcon> = {
  'trending-up': TrendingUp,
  'shield-check': ShieldCheck,
  handshake: Handshake,
  'check-circle': CheckCircle,
  star: Star,
  shield: Shield,
  car: Car,
  wrench: Wrench,
  info: Info,
  calendar: Calendar,
  fuel: Fuel,
  'map-pin': MapPin,
  phone: Phone,
  mail: Mail,
  clock: Clock,
  award: Award,
  zap: Zap,
  heart: Heart,
  'thumbs-up': ThumbsUp,
  'dollar-sign': DollarSign,
}

export const WhyCardsBlockComponent: React.FC<WhyCards> = ({ cards }) => {
  if (!cards || cards.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = iconMap[card.icon]
        return (
          <div
            key={card.id ?? index}
            className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-3"
          >
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {Icon && <Icon className="size-5 text-primary" />}
            </div>
            <h3 className="font-semibold text-foreground text-lg">{card.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
          </div>
        )
      })}
    </div>
  )
}
