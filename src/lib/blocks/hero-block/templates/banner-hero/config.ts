import type { GroupField } from 'payload'
import { bannerOptions } from '@/lib/blocks/hero-block/templates/banner-hero/bannerOptions'
import { fullWidthBannerConfig } from '@/lib/blocks/hero-block/templates/banner-hero/templates/full-width/config'
import { overlayBannerConfig } from '@/lib/blocks/hero-block/templates/banner-hero/templates/overlay/config'
import { ctaOverlayBannerConfig } from '@/lib/blocks/hero-block/templates/banner-hero/templates/cta-overlay/config'

export const bannerHeroConfig: GroupField = {
  type: 'group',
  label: 'Banner Hero Content',
  name: 'bannerHeroContent',
  interfaceName: 'BannerHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'banner'),
  },
  fields: [
    {
      name: 'bannerTemplate',
      type: 'select',
      label: 'Banner Template',
      options: bannerOptions,
      required: true,
      defaultValue: 'full-width',
    },
    fullWidthBannerConfig,
    overlayBannerConfig,
    ctaOverlayBannerConfig,
  ],
}
