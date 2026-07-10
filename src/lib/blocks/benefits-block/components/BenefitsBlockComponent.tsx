import type { Benefits } from '@/payload-types'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { cn } from '@/lib/utils/cn'
import React from 'react'

const columnClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-3',
}

export const BenefitsBlockComponent: React.FC<Benefits> = ({ columns = '3', items }) => {
  if (!items || items.length === 0) return null

  const gridClass = columnClasses[columns ?? '3'] ?? columnClasses['3']

  return (
    <div className={cn('grid gap-6 max-w-4xl mx-auto', gridClass)}>
      {items.map((item, index) => {
        const Icon = lucideIconMap[item.icon]
        return (
          <div key={item.id ?? index} className="flex gap-4">
            {Icon && <Icon className="size-6 text-primary shrink-0 mt-0.5" />}
            <div>
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
