'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

import type { Vehicle } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'

type GalleryItem = NonNullable<NonNullable<Vehicle['gallery']>[number]>

type VehicleGalleryProps = {
  vehicleName: string
  gallery: GalleryItem[]
}

export function VehicleGallery({ vehicleName, gallery }: VehicleGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (gallery.length === 0) {
    return null
  }

  return (
    <>
      <section className="py-14 px-4">
        <div className="container mx-auto">
          <h2 className="text-primary text-3xl font-bold text-center mb-10">
            {vehicleName} Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {gallery.map((item, i) => (
              <button
                key={item.id ?? i}
                onClick={() => setLightboxIndex(i)}
                aria-label={`Open gallery image ${i + 1}`}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <MediaImage
                  resource={item.image}
                  fill
                  imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                  size="(max-width: 768px) 50vw, 25vw"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-white/70 z-10 p-2"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery"
          >
            <X className="size-7" />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white hover:text-white/70 z-10 p-2"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((n) => (n !== null ? n - 1 : null))
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-9" />
            </button>
          )}

          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <MediaImage
              resource={gallery[lightboxIndex]?.image}
              fill
              imgClassName="object-contain"
              size="100vw"
              priority
            />
          </div>

          {lightboxIndex < gallery.length - 1 && (
            <button
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white hover:text-white/70 z-10 p-2"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((n) => (n !== null ? n + 1 : null))
              }}
              aria-label="Next image"
            >
              <ChevronRight className="size-9" />
            </button>
          )}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {gallery.length}
          </p>
        </div>
      )}
    </>
  )
}
