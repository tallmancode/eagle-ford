import type { Block } from 'payload'
import { heroOptions } from '@/lib/blocks/hero-block/heroOptions'
import { carouselHeroConfig } from '@/lib/blocks/hero-block/templates/carousel-hero/config'
import { bannerHeroConfig } from '@/lib/blocks/hero-block/templates/banner-hero/config'

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
    carouselHeroConfig,
    bannerHeroConfig,
  ],
}
