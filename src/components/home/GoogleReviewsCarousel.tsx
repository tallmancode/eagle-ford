'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils/cn'

type Review = {
  id: number
  name: string
  avatar: string
  rating: number
  text: string
  timeAgo: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Michahn N',
    avatar: 'MN',
    rating: 5,
    text: 'We would like to sincerely thank Humphrey Mabuza for his outstanding after-sales service. His professionalism, attention to detail, and genuine care for our vehicle made the entire experience exceptional.',
    timeAgo: '1 month ago',
  },
  {
    id: 2,
    name: 'Thabo Dlamini',
    avatar: 'TD',
    rating: 5,
    text: 'Absolutely fantastic experience at Eagle Ford! The team was incredibly helpful from the moment I walked in. They found me the perfect vehicle at a great price. Highly recommend!',
    timeAgo: '2 weeks ago',
  },
  {
    id: 3,
    name: 'Priya Naidoo',
    avatar: 'PN',
    rating: 5,
    text: "I've been bringing my Ford Ranger here for service for 3 years and the quality is always top notch. The staff are friendly, efficient and always keep me informed throughout the process.",
    timeAgo: '3 weeks ago',
  },
  {
    id: 4,
    name: 'Lebo Sithole',
    avatar: 'LS',
    rating: 5,
    text: 'Exceptional customer service! From the test drive to the final paperwork, everything was seamless. The sales consultant really listened to what I needed and found the ideal car for my family.',
    timeAgo: '1 month ago',
  },
  {
    id: 5,
    name: 'Riaan van der Berg',
    avatar: 'RV',
    rating: 5,
    text: "Eagle Ford's service department is outstanding. They completed the service ahead of schedule, kept me updated via SMS, and the price was exactly as quoted. Will definitely be back!",
    timeAgo: '2 months ago',
  },
  {
    id: 6,
    name: 'Zanele Mokoena',
    avatar: 'ZM',
    rating: 5,
    text: "Bought my Ford EcoSport here last month and I couldn't be happier. The whole team made me feel valued and the handover experience was memorable. 5 stars without hesitation!",
    timeAgo: '3 months ago',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn('w-6 h-6', i < rating ? 'text-yellow-400' : 'text-gray-300')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 74 24" className="h-5 w-auto" aria-label="Google">
      <path
        d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z"
        fill="#4285F4"
      />
      <path
        d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"
        fill="#EA4335"
      />
      <path
        d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.81c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.49 3.1 3.54.01 2.03-1.36 3.5-3.1 3.5z"
        fill="#4285F4"
      />
      <path
        d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"
        fill="#FBBC05"
      />
      <path d="M58 .24h2.51v17.57H58z" fill="#34A853" />
      <path
        d="M68.26 15.52c-1.3 0-2.22-.59-2.82-1.76l7.77-3.21-.26-.66c-.48-1.3-1.96-3.7-4.97-3.7-2.99 0-5.48 2.35-5.48 5.81 0 3.26 2.46 5.81 5.76 5.81 2.66 0 4.2-1.63 4.84-2.57l-1.98-1.32c-.66.96-1.56 1.6-2.86 1.6zm-.18-7.15c1.03 0 1.91.53 2.2 1.28l-5.25 2.17c0-2.44 1.73-3.45 3.05-3.45z"
        fill="#EA4335"
      />
    </svg>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = React.useState(false)
  const isLong = review.text.length > 120
  const displayText = expanded || !isLong ? review.text : review.text.slice(0, 120) + '...'

  return (
    <div className="flex flex-col items-center text-center bg-[#f5f5f5] rounded-2xl p-6 h-full gap-3 shadow-sm">
      <StarRating rating={review.rating} />

      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-800 leading-relaxed">
          {displayText}
          {isLong && !expanded && (
            <>
              {' '}
              <button
                onClick={() => setExpanded(true)}
                className="text-blue-600 font-bold hover:underline"
              >
                Read more
              </button>
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm ring-2 ring-white">
          {review.avatar}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-sm text-gray-900">{review.name}</span>
          <svg
            className="w-4 h-4 text-blue-500 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <span className="text-xs text-gray-500">{review.timeAgo}</span>
        <GoogleLogo />
      </div>
    </div>
  )
}

export default function GoogleReviewsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => setCurrent(api.selectedScrollSnap()))
  }, [api])

  return (
    <div className="relative px-10">
      <Carousel setApi={setApi} opts={{ align: 'start', loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
              <ReviewCard review={review} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="-left-2" variant="outline" size="icon" icon={ChevronLeft} />
        <CarouselNext className="-right-2" variant="outline" size="icon" icon={ChevronRight} />
      </Carousel>

      {count > 0 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-colors',
                i === current ? 'bg-gray-600' : 'bg-gray-300',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
