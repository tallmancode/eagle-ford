'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { MediaImage } from '@/components/ui/media-image'
import type { WaveHero as WaveHeroPayload, Hero } from '@/payload-types'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import React from 'react'
import { renderTextWithColorTags } from '@/lib/blocks/heading-block/utils/renderTextWithColorTags'
import { cn } from '@/lib/utils/cn'
import { resolveLinkFieldHref } from '@/lib/utils/resolveLinkFieldHref'

const DEFAULT_INTERVAL = 5000
const DEFAULT_OVERLAY_OPACITY = 30

const overlayColorMap: Record<string, string> = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  dark: 'bg-dark-950',
  danger: 'bg-red-600',
}

type WaveHeroSlide = NonNullable<WaveHeroPayload['slides']>[number]

function SlideOverlay({ slide }: { slide: WaveHeroSlide }) {
  const overlayColor = slide.overlayColor ?? 'secondary'
  const opacity = Math.min(100, Math.max(0, slide.overlayOpacity ?? DEFAULT_OVERLAY_OPACITY))

  if (overlayColor === 'none' || opacity === 0) return null

  const overlayClass = overlayColorMap[overlayColor] ?? overlayColorMap.secondary

  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 z-10', overlayClass)}
      style={{ opacity: opacity / 100 }}
    />
  )
}

function CtaAnchor({
  href,
  openInNewTab,
  label,
}: {
  href: string
  openInNewTab: boolean
  label: string
}) {
  const linkClass =
    'text-[0.95rem] tracking-wide text-white/95 border-2 p-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

  if (openInNewTab) {
    return (
      <a href={href} className={linkClass} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClass}>
      {label}
    </Link>
  )
}

function SlideCtas({ slide }: { slide: WaveHeroSlide }) {
  const primary = resolveLinkFieldHref(slide.primaryLink ?? undefined)

  const primaryLabel = slide.primaryLink?.label?.trim()

  if (!primary || !primaryLabel) return null

  return (
    <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-10">
      {primary && primaryLabel ? (
        <CtaAnchor href={primary.href} openInNewTab={primary.openInNewTab} label={primaryLabel} />
      ) : null}
    </div>
  )
}

export const WaveHero: React.FC<Hero> = (props) => {
  const heroContent = props.waveHero
  const { autoPlay = true, autoPlayInterval = DEFAULT_INTERVAL, showWave } = heroContent ?? {}

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
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    }),
  )

  if (!heroContent?.slides?.length) return null

  return (
    <div className="relative w-full select-none " aria-label="Featured">
      <Carousel
        className="relative w-full select-none"
        setApi={setApi}
        opts={{ loop: true }}
        plugins={autoPlay ? [plugin.current] : []}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {heroContent.slides.map((slide, index) => (
            <CarouselItem key={slide.id ?? `slide-${index}`}>
              <div className="relative min-h-[min(92svh,56rem)] w-full overflow-hidden z-5">
                <MediaImage
                  resource={slide.image}
                  fill
                  priority={index === 0}
                  imgClassName="object-cover"
                  size="100vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <SlideOverlay slide={slide} />
                <div className="absolute inset-0 flex items-center container z-20">
                  <div className="pointer-events-auto w-full max-w-3xl px-[clamp(1.25rem,5vw,4rem)] py-[clamp(2rem,8vh,5rem)]">
                    <div className="text-left text-white" aria-live="polite">
                      <h2 className="text-[clamp(1.85rem,4.2vw,3.25rem)] font-semibold leading-[1.12] tracking-tight">
                        {renderTextWithColorTags(slide.title)}
                      </h2>
                      {slide.subtitle?.trim() ? (
                        <p className="mt-4 max-w-xl text-[clamp(1.5rem,1.8vw,1.8rem)] lg:text-[clamp(1rem,1.8vw,1.8rem)] leading-relaxed text-white">
                          {renderTextWithColorTags(slide.subtitle)}
                        </p>
                      ) : null}
                      <SlideCtas slide={slide} />
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute left-[clamp(0.75rem,2.5vw,1.75rem)] top-1/2 -translate-y-1/2 hidden md:block">
          <CarouselPrevious
            className="left-0 top-0 z-20 rounded-none  h-12 w-12 bg-light-50 text-primary-500 hover:bg-light-50/40 "
            size="lg"
            variant="outline"
          />
          <CarouselNext
            className="left-0 top-15 z-20 rounded-none  h-12 w-12 bg-light-50 text-primary-500 hover:bg-light-50/40 "
            size="lg"
            variant="outline"
          />
        </div>
      </Carousel>

      <div
        className="pointer-events-auto absolute bottom-[clamp(1.25rem,3vh,2rem)] right-[clamp(1.25rem,3vw,2.5rem)] z-10 flex max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 gap-[0.45rem]"
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

      {showWave && (
        <div className="absolute h-[30%] -bottom-1 w-full z-5">
          <svg
            className="h-full w-full"
            fill="#ffffff"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            viewBox="0 0 1440 150"
          >
            <path d="M0,139.588931 C152,152.720009 299.666667,139.401344 443,99.6329343 C658,39.9803202 681,66.1486839 905,90.6287661 C1129,115.108848 1222,59.3955578 1293,37.4478979 C1340.33333,22.8161246 1389.33333,16.1567919 1440,17.4698997 L1440,150 L0,150 L0,139.588931 Z"></path>
            <path
              d="M0,117.980769 C152,145.786435 299.666667,138.940533 443,97.4430619 C658,35.1968558 697,56.6671048 921,82.2115385 C1145,107.755972 1222,55.4562342 1293,32.5543282 C1340.33333,17.2863909 1389.33333,10.337522 1440,11.7077215 L1440,150 L0,150 L0,117.980769 Z"
              fillOpacity="0.3"
            ></path>
            <path
              d="M0,106.034486 C156.666667,132.662839 291.666667,129.406134 405,96.2643713 C575,46.5517277 637,36.0308187 861,62.6436817 C1085,89.2565447 1215,51.1586623 1286,27.2988541 C1333.33333,11.3923153 1384.66667,2.2926973 1440,1.13686838e-13 L1440,150 L0,150 L0,106.034486 Z"
              fillOpacity="0.3"
            ></path>
          </svg>
        </div>
      )}
    </div>
  )
}

export default WaveHero
