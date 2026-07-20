import type { Hero } from '@/payload-types'
import { MediaImage } from '@/components/ui/media-image'

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
        maxWidth={1920}
        size="100vw"
      />
    </section>
  )
}
