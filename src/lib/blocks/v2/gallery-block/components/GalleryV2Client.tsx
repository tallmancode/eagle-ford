'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useState } from 'react'
import { MediaImage } from '@/components/ui/media-image'
import { cn } from '@/lib/utils/cn'
import type { GalleryV2, Media } from '@/payload-types'

type GalleryItem = NonNullable<GalleryV2['images']>[number]

const columnClasses: Record<string, string> = {
  '2': 'grid-cols-1 sm:grid-cols-2',
  '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function GalleryV2Client({
  images,
  columns = '3',
}: {
  images: GalleryItem[]
  columns?: GalleryV2['columns']
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const gridClass = columnClasses[columns ?? '3'] ?? columnClasses['3']

  const closeLightbox = () => setLightboxIndex(null)
  const goPrev = () => setLightboxIndex((n) => (n !== null && n > 0 ? n - 1 : n))
  const goNext = () =>
    setLightboxIndex((n) => (n !== null && n < images.length - 1 ? n + 1 : n))

  return (
    <>
      <div className={cn('grid gap-4', gridClass)}>
        {images.map((item, index) => {
          const media = item.image && typeof item.image === 'object' ? (item.image as Media) : null
          if (!media) return null

          return (
            <figure key={item.id ?? index} className="m-0">
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open gallery image ${index + 1}`}
                className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <MediaImage
                  resource={media}
                  alt={item.imageAlt ?? undefined}
                  fill
                  imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
                  maxWidth={800}
                  size="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </button>
              {item.caption ? (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          )
        })}
      </div>

      {lightboxIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
        >
          <button
            className="absolute right-4 top-4 z-10 p-2 text-white hover:text-white/70"
            onClick={closeLightbox}
            aria-label="Close gallery"
            type="button"
          >
            <X className="size-7" />
          </button>

          {lightboxIndex > 0 ? (
            <button
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-2 text-white hover:text-white/70 md:left-6"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeft className="size-9" />
            </button>
          ) : null}

          <div
            className="relative aspect-video w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaImage
              resource={images[lightboxIndex]?.image}
              alt={
                images[lightboxIndex]?.imageAlt ??
                images[lightboxIndex]?.caption ??
                undefined
              }
              fill
              imgClassName="object-contain"
              maxWidth={1920}
              size="100vw"
              priority
            />
          </div>

          {lightboxIndex < images.length - 1 ? (
            <button
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-2 text-white hover:text-white/70 md:right-6"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              aria-label="Next image"
              type="button"
            >
              <ChevronRight className="size-9" />
            </button>
          ) : null}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      ) : null}
    </>
  )
}
