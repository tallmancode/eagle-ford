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
import { Hero } from '@/payload-types'
import Autoplay from 'embla-carousel-autoplay'
import { MediaImage } from '@/components/ui/media-image'

const DEFAULT_INTERVAL = 5000

const alignmentClasses = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

export const OverlayCarousel: React.FC<Hero> = (props) => {
  const heroContent = props.carouselHeroContent
  const slides = heroContent?.overlayCarouselContent?.slides ?? []
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
            const isFirstSlide = index === 0
            const align =
              (slide.alignment as keyof typeof alignmentClasses | null | undefined) ?? 'left'
            const alignClass = alignmentClasses[align] ?? alignmentClasses.left

            return (
              <CarouselItem key={slide.id}>
                <div className="relative w-full overflow-hidden">
                  <MediaImage
                    imgClassName="w-full h-auto block"
                    resource={slide.image}
                    priority={isFirstSlide}
                    loading={isFirstSlide ? 'eager' : 'lazy'}
                    size={isFirstSlide ? '100vw' : undefined}
                    quality={isFirstSlide ? 65 : 75}
                  />

                  <div className="absolute inset-0 bg-dark-950/50" aria-hidden />

                  {(slide.heading || slide.subheading) && (
                    <div className="absolute inset-0 flex items-center">
                      <div className={`container flex flex-col gap-3 px-4 ${alignClass}`}>
                        {slide.heading && (
                          <h2 className="text-2xl font-bold text-light-50 sm:text-3xl md:text-4xl lg:text-5xl">
                            {slide.heading}
                          </h2>
                        )}
                        {slide.subheading && (
                          <p className="max-w-2xl text-base text-light-200 md:text-lg">
                            {slide.subheading}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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

export default OverlayCarousel
