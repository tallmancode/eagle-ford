import { DictionaryHero } from '@/lib/blocks/hero-block/templates/dictionary-hero/DictionaryHero'
import { GridHero } from '@/lib/blocks/hero-block/templates/grid-hero/GridHero'
import CarouselHero from '@/lib/blocks/hero-block/templates/carousel-hero/CarouselHero'
import WaveHero from '@/lib/blocks/hero-block/templates/wave-hero/WaveHero'
import { BannerHero } from '@/lib/blocks/hero-block/templates/banner-hero/BannerHero'
import { VideoBannerHero } from '@/lib/blocks/hero-block/templates/video-banner-hero/VideoBannerHero'
import { CtaHero } from '@/lib/blocks/hero-block/templates/cta-hero/CtaHero'
import { PortraitPunchHero } from '@/lib/blocks/hero-block/templates/portrait-punch-hero/PortraitPunchHero'
import { HeadlineHero } from '@/lib/blocks/hero-block/templates/headline-hero/HeadlineHero'

export const HeroMappings = {
  cta: CtaHero,
  dictionary: DictionaryHero,
  grid: GridHero,
  carousel: CarouselHero,
  banner: BannerHero,
  'video-banner': VideoBannerHero,
  wave: WaveHero,
  'portrait-punch': PortraitPunchHero,
  headline: HeadlineHero,
}
