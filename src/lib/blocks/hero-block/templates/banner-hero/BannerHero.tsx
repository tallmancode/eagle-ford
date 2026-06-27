import type { Hero } from '@/payload-types'
import { BannerMappings } from '@/lib/blocks/hero-block/templates/banner-hero/bannerMappings'

export type BannerKey = keyof typeof BannerMappings

export const BannerHero: React.FC<Hero> = (props) => {
  const { bannerHeroContent } = props
  const bannerTemplate = bannerHeroContent?.bannerTemplate

  if (!bannerTemplate || !(bannerTemplate in BannerMappings)) {
    console.warn(
      `Banner template "${bannerTemplate}" not found in BannerMappings. Available templates:`,
      Object.keys(BannerMappings),
    )
    return null
  }

  const BannerToRender = BannerMappings[bannerTemplate as BannerKey]

  return <BannerToRender {...props} />
}
