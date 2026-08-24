import type { Hero } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'
import { FULL_BLEED_IMAGE_MAX_WIDTH } from '@/lib/utils/getOptimalMediaSize'

export const FullWidthBanner: React.FC<Hero> = (props) => {
  const { bannerHeroContent } = props

  if (!bannerHeroContent?.fullWidthBannerContent?.image) return null

  return (
    <section className="relative w-full overflow-hidden">
      <MediaImage
        resource={bannerHeroContent.fullWidthBannerContent.image}
        imgClassName="w-full h-auto block"
        priority
        loading="eager"
        maxWidth={FULL_BLEED_IMAGE_MAX_WIDTH}
        size="100vw"
      />
    </section>
  )
}
