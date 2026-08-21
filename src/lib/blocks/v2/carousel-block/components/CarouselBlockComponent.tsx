import type { StyleValues } from '@/lib/blocks/v2/apply/styles'
import { applyStyles } from '@/lib/blocks/v2/apply/styles'
import { getBetterEditorBlockProps } from '@/lib/blocks/betterEditor'
import { CarouselV2Client } from '@/lib/blocks/v2/carousel-block/components/CarouselV2Client'
import type { CarouselV2 } from '@/payload-types'

export function CarouselV2BlockComponent(props: CarouselV2) {
  const { styles, slides, autoPlay, autoPlayInterval, showArrows, showDots } = props
  if (!slides || slides.length === 0) return null

  const { className, style, attrs } = applyStyles((styles ?? {}) as StyleValues, { slot: 'root' })

  return (
    <div
      className={className || undefined}
      style={style}
      {...attrs}
      {...getBetterEditorBlockProps(props)}
    >
      <CarouselV2Client
        slides={slides}
        autoPlay={autoPlay}
        autoPlayInterval={autoPlayInterval}
        showArrows={showArrows}
        showDots={showDots}
      />
    </div>
  )
}
