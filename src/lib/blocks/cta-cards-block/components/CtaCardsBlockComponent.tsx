import type { CtaCards } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const CtaCardsBlockComponent: React.FC<CtaCards> = ({ cards }) => {
  if (!cards || cards.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        if (!card.url) return null

        const newTabProps = card.newTab
          ? { rel: 'noopener noreferrer', target: '_blank' as const }
          : {}

        return (
          <div
            key={card.id ?? index}
            className="bg-card border rounded-2xl p-8 flex flex-col justify-between shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground mb-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
            </div>
            <Link href={card.url} {...newTabProps}>
              <Button variant="outline" className="rounded-full w-full">
                {card.label}
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
