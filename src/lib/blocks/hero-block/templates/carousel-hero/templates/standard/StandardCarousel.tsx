'use client'

import React from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Hero, Page, Special, SpecialCategory } from '@/payload-types'
import Autoplay from 'embla-carousel-autoplay'
import { MediaImage } from '@/components/ui/media-image'
import { getSpecialCategoryPath } from '@/lib/specials/paths'
import { getPagePath } from '@/lib/utils/getPagePath'
import { FULL_BLEED_IMAGE_MAX_WIDTH } from '@/lib/utils/getOptimalMediaSize'
import Link from 'next/link'

const DEFAULT_INTERVAL = 5000
/** Non-LCP slides: smaller optimizer source + lower quality (still full-bleed when shown). */
const ADJACENT_SLIDE_MAX_WIDTH = 1920
const FIRST_SLIDE_QUALITY = 65
const ADJACENT_SLIDE_QUALITY = 65

type SlideReference = NonNullable<
  NonNullable<Hero['carouselHeroContent']>['standardCarouselContent']
>['slides'][number]['reference']

function resolveSlideHref(reference: SlideReference): string | null {
  if (!reference) return null
  const { relationTo, value } = reference
  if (typeof value === 'string') return null

  if (relationTo === 'pages') {
    const page = value as Page
    if (!page.slug) return null
    return getPagePath(page)
  }

  if (relationTo === 'special-categories') {
    const category = value as SpecialCategory
    if (!category.slug) return null
    return getSpecialCategoryPath(category.slug)
  }

  if (relationTo === 'specials') {
    const special = value as Special
    if (!special.slug) return null
    const category = special.category
    if (typeof category !== 'object' || !category?.slug) return null
    return getSpecialCategoryPath(category.slug, special.slug)
  }

  return null
}

function isNearSlide(index: number, current: number, total: number): boolean {
  if (total <= 0) return false
  if (index === 0) return true // keep LCP slide mounted
  if (index === current) return true
  if (index === (current + 1) % total) return true
  if (index === (current - 1 + total) % total) return true
  return false
}

function slideAspectRatio(image: unknown): number {
  if (image && typeof image === 'object' && 'width' in image && 'height' in image) {
    const width = Number((image as { width?: number }).width)
    const height = Number((image as { height?: number }).height)
    if (width > 0 && height > 0) return width / height
  }
  return 21 / 9
}

export const StandardCarousel: React.FC<Hero> = (props) => {
  const heroContent = props.carouselHeroContent
  const slides = heroContent?.standardCarouselContent?.slides ?? []
  const {
    autoPlay = true,
    autoPlayInterval = DEFAULT_INTERVAL,
    enableInteraction = true,
  } = heroContent ?? {}

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

  if (!heroContent || slides.length === 0) return null

  return (
    <div className="relative w-full select-none">
      <Carousel
        className="relative w-full select-none"
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
            const loadImage = isNearSlide(index, current, slides.length)
            const image = loadImage ? (
              <MediaImage
                imgClassName="w-full h-auto"
                resource={slide.image}
                mobileResource={slide.mobileImage}
                priority={isFirstSlide}
                loading={isFirstSlide ? 'eager' : 'lazy'}
                maxWidth={isFirstSlide ? FULL_BLEED_IMAGE_MAX_WIDTH : ADJACENT_SLIDE_MAX_WIDTH}
                mobileMaxWidth={768}
                size="100vw"
                quality={isFirstSlide ? FIRST_SLIDE_QUALITY : ADJACENT_SLIDE_QUALITY}
              />
            ) : (
              <div
                className="w-full bg-dark-900"
                style={{ aspectRatio: slideAspectRatio(slide.image) }}
                aria-hidden
              />
            )
            return (
              <CarouselItem key={slide.id}>
                {href ? (
                  <Link
                    href={href}
                    className="block"
                    tabIndex={-1}
                    aria-label="View details"
                    data-gtm-cta="hero-slide"
                    data-gtm-cta-location="hero-carousel"
                  >
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </CarouselItem>
            )
          })}
        </CarouselContent>

        {enableInteraction && (
          <>
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
          </>
        )}
      </Carousel>

      <div
        className="absolute bottom-[clamp(1.25rem,3vh,2rem)] right-[clamp(1.25rem,3vw,2.5rem)] z-10 flex gap-[0.45rem] max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2"
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

export default StandardCarousel
