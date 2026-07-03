import type { StatsBlock as StatsBlockType } from '@/payload-types'
import React from 'react'

export const StatsBlockComponent: React.FC<StatsBlockType> = ({ stats }) => {
  if (!stats || stats.length === 0) return null

  return (
    <section className="bg-foreground text-background py-12 px-4">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={stat.id ?? index} className="flex flex-col items-center gap-1">
            <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
            <p className="text-sm uppercase tracking-widest opacity-70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
