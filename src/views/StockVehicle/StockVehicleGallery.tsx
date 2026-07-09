'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import { MediaImage } from '@/components/ui/media-image'
import type { MotorCityStockVehicleMedia } from '@/lib/motor-city-stock/types'
import { getStockGalleryImages } from '@/lib/stock-vehicle/media'

type Props = {
  vehicleName: string
  media: MotorCityStockVehicleMedia[]
}

export function StockVehicleGallery({ vehicleName, media }: Props) {
  const images = getStockGalleryImages(media)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length <= 1) return null

  return (
    <>
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-2xl font-bold text-primary-900 md:text-3xl">
            Gallery
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {images.map((item, index) => (
              <button
                key={item.id ?? index}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open gallery image ${index + 1}`}
                className="relative aspect-[4/3] overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <MediaImage
                  resource={item.url}
                  alt={`${vehicleName} image ${index + 1}`}
                  fill
                  imgClassName="object-cover transition-transform duration-300 hover:scale-105"
                  size="(max-width: 768px) 50vw, 25vw"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 p-2 text-white hover:text-white/70"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery"
          >
            <X className="size-7" />
          </button>

          {lightboxIndex > 0 && (
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 p-2 text-white hover:text-white/70 md:left-6"
              onClick={(event) => {
                event.stopPropagation()
                setLightboxIndex((index) => (index !== null ? index - 1 : null))
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-9" />
            </button>
          )}

          <div
            className="relative aspect-video w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <MediaImage
              resource={images[lightboxIndex]?.url}
              alt={`${vehicleName} image ${lightboxIndex + 1}`}
              fill
              imgClassName="object-contain"
              size="100vw"
              priority
            />
          </div>

          {lightboxIndex < images.length - 1 && (
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 p-2 text-white hover:text-white/70 md:right-6"
              onClick={(event) => {
                event.stopPropagation()
                setLightboxIndex((index) => (index !== null ? index + 1 : null))
              }}
              aria-label="Next image"
            >
              <ChevronRight className="size-9" />
            </button>
          )}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  )
}
