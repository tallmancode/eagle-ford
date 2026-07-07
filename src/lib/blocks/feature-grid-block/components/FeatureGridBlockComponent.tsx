import type { FeatureGrid } from '@/payload-types'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { cn } from '@/lib/utils/cn'
import React from 'react'

const columnClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}

export const FeatureGridBlockComponent: React.FC<FeatureGrid> = ({ columns = '2', items }) => {
  if (!items || items.length === 0) return null

  const gridClass = columnClasses[columns ?? '2'] ?? columnClasses['2']

  return (
    <ul className={cn('grid gap-4', gridClass)}>
      {items.map((item, index) => {
        const Icon = lucideIconMap[item.icon]
        return (
          <li key={item.id ?? index} className="flex items-center gap-3">
            <span className="flex items-center justify-center size-9 rounded-full bg-primary/10 shrink-0">
              {Icon && <Icon className="size-4 text-primary" />}
            </span>
            <span className="font-medium text-foreground">{item.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
