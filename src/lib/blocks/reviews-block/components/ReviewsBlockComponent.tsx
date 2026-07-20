import type { Reviews } from '@/payload-types'
import React from 'react'
import { googleReviews } from '@/lib/blocks/reviews-block/data/googleReviews'
import { ReviewsCarousel } from '@/lib/blocks/reviews-block/components/ReviewsCarousel'

export const ReviewsBlockComponent: React.FC<Reviews> = () => {
  if (googleReviews.length === 0) return null

  return (
    <div className="flex w-full flex-col py-4">
      <h2 className="mb-8 text-center text-3xl font-bold text-primary md:text-4xl">Our Reviews</h2>
      <ReviewsCarousel reviews={googleReviews} />
    </div>
  )
}
