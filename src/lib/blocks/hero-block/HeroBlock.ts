import type { Block } from 'payload'
import { heroOptions } from '@/lib/blocks/hero-block/heroOptions'
import { dictionaryHeroConfig } from '@/lib/blocks/hero-block/templates/dictionary-hero/config'
import { gridHeroConfig } from '@/lib/blocks/hero-block/templates/grid-hero/config'
import { carouselHeroConfig } from '@/lib/blocks/hero-block/templates/carousel-hero/config'
import { waveHeroConfig } from '@/lib/blocks/hero-block/templates/wave-hero/config'
import { bannerHeroConfig } from '@/lib/blocks/hero-block/templates/banner-hero/config'
import { videoBannerHeroConfig } from '@/lib/blocks/hero-block/templates/video-banner-hero/config'
import { ctaHeroConfig } from '@/lib/blocks/hero-block/templates/cta-hero/config'
import { portraitPunchHeroConfig } from '@/lib/blocks/hero-block/templates/portrait-punch-hero/config'
import { headlineHeroConfig } from '@/lib/blocks/hero-block/templates/headline-hero/config'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  admin: {
    components: {
      Label: '/lib/blocks/hero-block/components/HeroBlockLabel',
    },
    images: {
      thumbnail: '/blocks/hero-block.jpg',
    },
  },
  fields: [
    {
      type: 'select',
      name: 'template',
      label: 'Template',
      options: heroOptions,
      required: true,
      admin: {
        components: {
          Field: '@/lib/blocks/hero-block/components/HeroTemplateField#HeroTemplateField',
        },
      },
    },
    ctaHeroConfig,
    dictionaryHeroConfig,
    gridHeroConfig,
    carouselHeroConfig,
    bannerHeroConfig,
    videoBannerHeroConfig,
    waveHeroConfig,
    portraitPunchHeroConfig,
    headlineHeroConfig,
  ],
}
