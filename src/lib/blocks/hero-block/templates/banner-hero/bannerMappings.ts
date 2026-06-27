import { FullWidthBanner } from '@/lib/blocks/hero-block/templates/banner-hero/templates/full-width/FullWidthBanner'
import { OverlayBanner } from '@/lib/blocks/hero-block/templates/banner-hero/templates/overlay/OverlayBanner'
import { CtaOverlayBanner } from '@/lib/blocks/hero-block/templates/banner-hero/templates/cta-overlay/CtaOverlayBanner'

export const BannerMappings = {
  'full-width': FullWidthBanner,
  overlay: OverlayBanner,
  'cta-overlay': CtaOverlayBanner,
}
