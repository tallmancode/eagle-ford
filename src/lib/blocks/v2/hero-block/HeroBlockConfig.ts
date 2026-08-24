import type { Block } from 'payload'
import { heroOptions } from '@/lib/blocks/hero-block/heroOptions'
import { carouselHeroConfig } from '@/lib/blocks/hero-block/templates/carousel-hero/config'
import { bannerHeroConfig } from '@/lib/blocks/hero-block/templates/banner-hero/config'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const HeroV2Block: Block = {
  slug: 'heroV2',
  labels: {
    singular: 'Hero (v2)',
    plural: 'Heroes (v2)',
  },
  admin: {
    group: 'Heroes and Banners',
    images: {
      icon: {
        url: '/blocks/hero-v2-block-icon.svg',
        alt: 'Hero (v2) icon',
      },
      thumbnail: {
        url: '/blocks/hero-v2-block-thumbnail.png',
        alt: 'Hero (v2) - full-width banner with headline and CTAs',
      },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
        },
        {
          label: 'Layout',
          fields: [StyleFields({ name: 'styles', label: false })],
        },
      ],
    },
  ],
}
