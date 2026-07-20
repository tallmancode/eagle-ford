'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'

import type { Vehicle } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils/cn'

type GalleryItem = NonNullable<NonNullable<Vehicle['gallery']>[number]>

type VehicleGalleryProps = {
  vehicleName: string
  gallery: GalleryItem[]
}

const DEFAULT_AUTOPLAY_INTERVAL = 5000

export function VehicleGallery({ vehicleName, gallery }: VehicleGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideCount, setSlideCount] = useState(0)

  const autoplayRef = useRef(
    Autoplay({
      delay: DEFAULT_AUTOPLAY_INTERVAL,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  )

  const updateCarouselState = useCallback(() => {
    if (!api) return
    setSlideCount(api.scrollSnapList().length)
    setCurrentSlide(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    updateCarouselState()
    const onSelect = () => setCurrentSlide(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api, updateCarouselState])

  if (gallery.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    autoplayRef.current?.stop()
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
    autoplayRef.current?.play()
  }

  const goToSlide = (index: number) => {
    api?.scrollTo(index)
  }

  const lightboxGoToPrevious = () => {
    setLightboxIndex((n) => (n !== null && n > 0 ? n - 1 : n))
  }

  const lightboxGoToNext = () => {
    setLightboxIndex((n) => (n !== null && n < gallery.length - 1 ? n + 1 : n))
  }

  return (
    <>
      <section className="py-14 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-primary text-3xl font-bold text-center mb-10">
            {vehicleName} Gallery
          </h2>

          <Carousel
            className="relative w-full"
            setApi={setApi}
            opts={{ loop: gallery.length > 1, align: 'start' }}
            plugins={[autoplayRef.current]}
            onMouseEnter={() => autoplayRef.current?.stop()}
            onMouseLeave={() => autoplayRef.current?.play()}
          >
            <div className={gallery.length > 1 ? 'px-12' : undefined}>
              <CarouselContent className="-ml-4">
                {gallery.map((item, index) => (
                  <CarouselItem
                    key={item.id ?? index}
                    className={cn(
                      'pl-4',
                      gallery.length === 1 && 'basis-full [&>button]:mx-auto [&>button]:max-w-3xl',
                      gallery.length === 2 && 'basis-[85%] sm:basis-1/2',
                      gallery.length >= 3 && 'basis-[85%] sm:basis-1/2 lg:basis-1/3',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(index)}
                      aria-label={`Open gallery image ${index + 1}`}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary block w-full"
                    >
                      <MediaImage
                        resource={item.image}
                        fill
                        imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
                        maxWidth={800}
                        size="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 30vw"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>

            {gallery.length > 1 && (
              <>
                <CarouselPrevious
                  className="left-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm hover:bg-muted disabled:opacity-40"
                  size="icon"
                  variant="outline"
                  aria-label="Previous gallery image"
                />
                <CarouselNext
                  className="right-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm hover:bg-muted disabled:opacity-40"
                  size="icon"
                  variant="outline"
                  aria-label="Next gallery image"
                />
              </>
            )}
          </Carousel>

          {gallery.length > 1 && (
            <div
              className="flex justify-center gap-2 mt-6"
              role="tablist"
              aria-label="Gallery slide indicators"
            >
              {Array.from({ length: slideCount || gallery.length }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === currentSlide}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-primary w-6' : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery lightbox"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-white/70 z-10 p-2"
            onClick={closeLightbox}
            aria-label="Close gallery"
          >
            <X className="size-7" />
          </button>

          {lightboxIndex > 0 && (
            <button
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white hover:text-white/70 z-10 p-2"
              onClick={(e) => {
                e.stopPropagation()
                lightboxGoToPrevious()
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
              maxWidth={1920}
              size="100vw"
              priority
            />
          </div>

          {lightboxIndex < gallery.length - 1 && (
            <button
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white hover:text-white/70 z-10 p-2"
              onClick={(e) => {
                e.stopPropagation()
                lightboxGoToNext()
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
