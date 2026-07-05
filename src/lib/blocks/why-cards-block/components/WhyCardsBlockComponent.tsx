import type { WhyCards } from '@/payload-types'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { cn } from '@/utilities/ui'
import React from 'react'

const columnClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export const WhyCardsBlockComponent: React.FC<WhyCards> = ({ columns = '3', cards }) => {
  if (!cards || cards.length === 0) return null

  const gridClass = columnClasses[columns ?? '3'] ?? columnClasses['3']

  return (
    <div className={cn('grid gap-6', gridClass)}>
      {cards.map((card, index) => {
        const Icon = lucideIconMap[card.icon]
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
