import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { googleReviews } from '@/lib/blocks/reviews-block/data/googleReviews'
import { ReviewsCarousel } from '@/lib/blocks/reviews-block/components/ReviewsCarousel'

type ReviewsV2Props = {
  source?: 'sample' | null
  styles?: StyleValues | null
  blockType?: string
  id?: string | null
}

export function ReviewsV2BlockComponent(props: ReviewsV2Props) {
  const { styles } = props
  if (googleReviews.length === 0) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={['flex w-full flex-col gap-4 py-4', className].filter(Boolean).join(' ')}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <ReviewsCarousel reviews={googleReviews} />
    </div>
  )
}
