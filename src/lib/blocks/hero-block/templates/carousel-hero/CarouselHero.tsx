'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Hero, Page } from '@/payload-types'
import React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { MediaImage } from '@/components/ui/media-image'
import { getPagePath } from '@/lib/utils/getPagePath'
import Link from 'next/link'

const DEFAULT_INTERVAL = 5000

function resolveSlideHref(
  reference:
    | {
        relationTo: 'pages'
        value: string | Page
      }
    | null
    | undefined,
): string | null {
  if (!reference) return null
  const { relationTo, value } = reference
  if (typeof value === 'string') return null
  if (relationTo === 'pages') {
    const page = value as Page
    if (!page.slug) return null
    return getPagePath(page)
  }
  return null
}

export const CarouselHero: React.FC<Hero> = (props) => {
  const heroContent = props.carouselHeroContent
  const { slides = [], autoPlay = true, autoPlayInterval = DEFAULT_INTERVAL } = heroContent ?? {}

  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  const plugin = React.useRef(
    Autoplay({
      delay: autoPlayInterval ?? DEFAULT_INTERVAL,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  )

  if (!heroContent) return null

  return (
    <div className="w-full select-none relative">
      <Carousel
        className="w-full select-none relative"
        setApi={setApi}
        opts={{ loop: true }}
        plugins={autoPlay ? [plugin.current] : []}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {slides.map((slide, index) => {
            const href = resolveSlideHref(slide.reference)
            const isFirstSlide = index === 0
            const image = (
              <MediaImage
                imgClassName="w-full h-auto"
                resource={slide.image}
                priority={isFirstSlide}
                loading={isFirstSlide ? 'eager' : 'lazy'}
                size={isFirstSlide ? '100vw' : undefined}
                quality={isFirstSlide ? 65 : 75}
              />
            )
            return (
              <CarouselItem key={slide.id}>
                {href ? (
                  <Link href={href} className="block" tabIndex={-1} aria-label="View details">
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </CarouselItem>
            )
          })}
        </CarouselContent>

        <CarouselPrevious
          className="left-[clamp(0.75rem,2.5vw,1.75rem)]"
          size={'lg'}
          variant={'outline'}
        />
        <CarouselNext
          className="right-[clamp(0.75rem,2.5vw,1.75rem)]"
          size={'lg'}
          variant={'outline'}
        />
      </Carousel>

      {/* Dot indicators */}
      <div
        className="absolute bottom-[clamp(1.25rem,3vh,2rem)] right-[clamp(1.25rem,3vw,2.5rem)] flex gap-[0.45rem] z-10 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:right-auto"
        role="tablist"
        aria-label="Slide indicators"
      >
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === current}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="inline-flex min-h-12 min-w-12 cursor-pointer items-center justify-center border-none bg-transparent p-0"
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 transition-[background-color,width,border-radius] duration-250 ease-in-out ${
                i === current
                  ? 'w-5.5 rounded-[3px] bg-white'
                  : 'w-1.5 rounded-full bg-white/40 hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default CarouselHero
