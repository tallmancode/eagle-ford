'use client'

import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { richTextConverters } from '@/components/rich-text/richTextConverters'
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
import type { Media } from '@/payload-types'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'

const columnClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-3',
}

type PopupCardV2 = {
  id?: string | null
  image: number | Media
  imageAlt?: string | null
  icon?: string | null
  title: string
  description: string
  buttonLabel: string
  popupTitle: string
  popupSubtitle?: string | null
  popupBody?: SerializedEditorState | null
}

type PopupCardsV2Props = {
  columns?: '1' | '2' | '3' | null
  cards?: PopupCardV2[] | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

function PopupCardItem({ card }: { card: PopupCardV2 }) {
  const image = card.image && typeof card.image === 'object' ? (card.image as Media) : null
  const Icon = card.icon ? lucideIconMap[card.icon] : undefined
  if (!image) return null

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
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
          {Icon ? <Icon className="size-5 text-white" /> : null}
          <span className="text-lg font-semibold text-white">{card.title}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
          {card.description}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full rounded-full">
              {card.buttonLabel ?? 'Find Out More'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle className="text-2xl text-primary">{card.popupTitle}</DialogTitle>
              {card.popupSubtitle ? (
                <p className="text-sm text-muted-foreground">{card.popupSubtitle}</p>
              ) : null}
            </DialogHeader>
            {card.popupBody ? (
              <div className="space-y-4 px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                <ConvertRichText
                  converters={richTextConverters}
                  data={card.popupBody as SerializedEditorState}
                />
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export function PopupCardsV2BlockComponent(props: PopupCardsV2Props) {
  const { cards, columns = '3', styles } = props
  if (!cards?.length) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={cn('grid gap-6', columnClasses[columns ?? '3'], className)}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      {cards.map((card, index) => (
        <PopupCardItem key={card.id ?? index} card={card} />
      ))}
    </div>
  )
}
