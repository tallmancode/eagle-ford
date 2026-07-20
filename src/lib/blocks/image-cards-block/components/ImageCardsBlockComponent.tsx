import type { ImageCards, Media } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/ui/media-image'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import React from 'react'

const columnClasses: Record<string, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

type ImageCardItem = NonNullable<ImageCards['items']>[number]

function newTabProps(openInNewTab: boolean | null | undefined) {
  return openInNewTab ? { rel: 'noopener noreferrer' as const, target: '_blank' as const } : {}
}

function ImageCard({ item }: { item: ImageCardItem }) {
  const image = item.image && typeof item.image === 'object' ? (item.image as Media) : null

  if (!image) return null

  const resolvedImageLink = resolveLinkFieldHref(item.imageLink)
  const resolvedCtaLink = resolveLinkFieldHref(item.link)

  const imageEl = (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
      <MediaImage
        resource={image}
        alt={item.imageAlt ?? undefined}
        fill
        imgClassName="object-cover"
        maxWidth={900}
        size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {resolvedImageLink ? (
        <Link
          href={resolvedImageLink.href}
          className="block"
          {...newTabProps(resolvedImageLink.openInNewTab)}
        >
          {imageEl}
        </Link>
      ) : (
        imageEl
      )}
      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
      {resolvedCtaLink && (
        <Button className="rounded-full w-fit" asChild>
          <Link href={resolvedCtaLink.href} {...newTabProps(resolvedCtaLink.openInNewTab)}>
            {item.link?.label ?? 'Explore'}
          </Link>
        </Button>
      )}
    </div>
  )
}

export const ImageCardsBlockComponent: React.FC<ImageCards> = ({ columns = '3', items }) => {
  if (!items || items.length === 0) return null

  const gridClass = columnClasses[columns ?? '3'] ?? columnClasses['3']

  return (
    <div className={cn('grid gap-8', gridClass)}>
      {items.map((item, index) => (
        <ImageCard key={item.id ?? index} item={item} />
      ))}
    </div>
  )
}
