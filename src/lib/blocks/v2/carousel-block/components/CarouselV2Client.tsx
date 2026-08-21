'use client'

import Autoplay from 'embla-carousel-autoplay'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MediaImage } from '@/components/ui/media-image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import type { CarouselV2, Media } from '@/payload-types'

type Slide = NonNullable<CarouselV2['slides']>[number]

export function CarouselV2Client({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
}: {
  slides: Slide[]
  autoPlay?: boolean | null
  autoPlayInterval?: number | null
  showArrows?: boolean | null
  showDots?: boolean | null
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideCount, setSlideCount] = useState(0)
  const delay = autoPlayInterval ?? 5000

  const autoplayRef = useRef(
    Autoplay({
      delay,
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

  const plugins = autoPlay ? [autoplayRef.current] : []

  return (
    <Carousel
      className="relative w-full"
      setApi={setApi}
      opts={{ loop: slides.length > 1, align: 'start' }}
      plugins={plugins}
      onMouseEnter={() => autoPlay && autoplayRef.current?.stop()}
      onMouseLeave={() => autoPlay && autoplayRef.current?.play()}
    >
      <div className={slides.length > 1 && showArrows ? 'px-12' : undefined}>
        <CarouselContent>
          {slides.map((slide, index) => {
            const media = slide.image && typeof slide.image === 'object' ? (slide.image as Media) : null
            if (!media) return null

            const image = (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <MediaImage
                  resource={media}
                  alt={slide.imageAlt ?? undefined}
                  fill
                  imgClassName="object-cover object-center"
                  maxWidth={1400}
                  size="100vw"
                />
              </div>
            )

            const linked = slide.linkUrl ? (
              <Link
                href={slide.linkUrl}
                className="block"
                {...(slide.newTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {})}
              >
                {image}
              </Link>
            ) : (
              image
            )

            return (
              <CarouselItem key={slide.id ?? index}>
                {linked}
                {slide.caption ? (
                  <p className="mt-2 text-center text-sm text-muted-foreground">{slide.caption}</p>
                ) : null}
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </div>

      {showArrows && slides.length > 1 ? (
        <>
          <CarouselPrevious
            className="left-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm hover:bg-muted disabled:opacity-40"
            size="icon"
            variant="outline"
            aria-label="Previous slide"
          />
          <CarouselNext
            className="right-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm hover:bg-muted disabled:opacity-40"
            size="icon"
            variant="outline"
            aria-label="Next slide"
          />
        </>
      ) : null}

      {showDots && slides.length > 1 ? (
        <div
          className="mt-6 flex justify-center gap-2"
          role="tablist"
          aria-label="Carousel slide indicators"
        >
          {Array.from({ length: slideCount || slides.length }).map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === currentSlide}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-primary' : 'bg-primary/30 hover:bg-primary/50'
              }`}
            />
          ))}
        </div>
      ) : null}
    </Carousel>
  )
}
