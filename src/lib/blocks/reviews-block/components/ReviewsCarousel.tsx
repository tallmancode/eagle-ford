'use client'

import React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { GoogleReview } from '@/lib/blocks/reviews-block/data/googleReviews'
import { cn } from '@/lib/utils/cn'

const AUTOPLAY_DELAY = 5000

function GoogleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="54"
      height="14"
      viewBox="0 0 200 60"
      aria-hidden
      className="shrink-0"
    >
      <text x="0" y="45" fontSize="48" fontWeight="bold">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC05">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
      </text>
    </svg>
  )
}

function StarRating({ rating, className }: { rating: number; className?: string }) {
  return (
    <div
      className={cn('text-lg leading-none text-yellow-400', className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: rating }, (_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  )
}

function ReviewCard({
  review,
  onReadMore,
}: {
  review: GoogleReview
  onReadMore: (review: GoogleReview) => void
}) {
  const textRef = React.useRef<HTMLParagraphElement>(null)
  const [showReadMore, setShowReadMore] = React.useState(false)

  React.useEffect(() => {
    const el = textRef.current
    if (!el) return
    setShowReadMore(el.scrollHeight > el.clientHeight + 1)
  }, [review.text])

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <Image
          src={review.avatarUrl}
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
          unoptimized
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{review.name}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1 text-xs text-muted-foreground">
            <span>{review.date} on</span>
            <GoogleLogo />
          </p>
        </div>
      </div>

      <StarRating rating={review.rating} className="mb-3" />

      <div className="flex min-h-0 flex-1 flex-col">
        <p
          ref={textRef}
          className="line-clamp-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line"
        >
          {review.text}
        </p>
        <div className="mt-auto pt-3">
          {showReadMore ? (
            <button
              type="button"
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => onReadMore(review)}
            >
              Read more
            </button>
          ) : (
            <span className="invisible text-sm" aria-hidden>
              Read more
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function ReviewModal({ review, onClose }: { review: GoogleReview | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!review) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [review, onClose])

  if (!review) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-name"
    >
      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card p-6 shadow-lg">
        <button
          type="button"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-xl text-muted-foreground hover:bg-muted"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="mb-4 flex items-center gap-3 pr-8">
          <Image
            src={review.avatarUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            unoptimized
          />
          <div className="min-w-0">
            <p id="review-modal-name" className="font-semibold text-foreground">
              {review.name}
            </p>
            <StarRating rating={review.rating} className="mt-1" />
          </div>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {review.text}
        </p>
      </div>
    </div>
  )
}

type ReviewsCarouselProps = {
  reviews: GoogleReview[]
}

export function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [selectedReview, setSelectedReview] = React.useState<GoogleReview | null>(null)

  const plugin = React.useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  )

  React.useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap())
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          loop: true,
          align: 'start',
        }}
        plugins={[plugin.current]}
      >
        <div className="px-12">
          <CarouselContent className="-ml-4">
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="h-auto pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="h-full">
                  <ReviewCard review={review} onReadMore={setSelectedReview} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>

        <CarouselPrevious
          className="left-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm hover:bg-muted disabled:opacity-40"
          variant="outline"
          size="icon"
        />
        <CarouselNext
          className="right-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-border bg-background shadow-sm hover:bg-muted disabled:opacity-40"
          variant="outline"
          size="icon"
        />
      </Carousel>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {reviews.map((review, index) => (
          <button
            key={review.id}
            type="button"
            className={cn(
              'h-2 w-2 rounded-full transition-colors',
              index === current
                ? 'bg-primary'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to review ${index + 1}`}
            aria-current={index === current ? 'true' : undefined}
          />
        ))}
      </div>

      <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </div>
  )
}
