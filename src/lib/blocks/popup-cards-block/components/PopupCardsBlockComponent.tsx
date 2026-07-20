'use client'

import type { Media, PopupCards } from '@/payload-types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MediaImage } from '@/components/ui/media-image'
import { lucideIconMap } from '@/lib/fields/lucide-icons'
import { cn } from '@/lib/utils/cn'
import React from 'react'
import { PopupCardSection } from './PopupCardSection'

const columnClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-3',
}

type PopupCard = NonNullable<PopupCards['cards']>[number]

function PopupCardItem({ card }: { card: PopupCard }) {
  const image = card.image && typeof card.image === 'object' ? (card.image as Media) : null
  const Icon = card.icon ? lucideIconMap[card.icon] : undefined

  if (!image) return null

  return (
    <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <MediaImage
          resource={image}
          alt={card.imageAlt ?? undefined}
          fill
          imgClassName="object-cover"
          maxWidth={900}
          size="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          {Icon && <Icon className="size-5 text-white" />}
          <span className="text-white font-semibold text-lg">{card.title}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
          {card.description}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-full w-full">
              {card.buttonLabel ?? 'Find Out More'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-primary text-2xl">{card.popupTitle}</DialogTitle>
              {card.popupSubtitle && (
                <p className="text-sm text-muted-foreground">{card.popupSubtitle}</p>
              )}
            </DialogHeader>
            <div className="px-6 pb-6 space-y-5">
              {card.popupIntro && (
                <p className="text-sm text-muted-foreground leading-relaxed">{card.popupIntro}</p>
              )}
              {card.popupSections?.map((section, index) => (
                <PopupCardSection key={section.id ?? index} section={section} />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export const PopupCardsBlockComponent: React.FC<PopupCards> = ({ columns = '3', cards }) => {
  if (!cards || cards.length === 0) return null

  const gridClass = columnClasses[columns ?? '3'] ?? columnClasses['3']

  return (
    <div className={cn('grid gap-6', gridClass)}>
      {cards.map((card, index) => (
        <PopupCardItem key={card.id ?? index} card={card} />
      ))}
    </div>
  )
}
