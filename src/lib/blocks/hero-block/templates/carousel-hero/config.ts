import type { GroupField } from 'payload'
import { carouselOptions } from '@/lib/blocks/hero-block/templates/carousel-hero/carouselOptions'
import { standardCarouselConfig } from '@/lib/blocks/hero-block/templates/carousel-hero/templates/standard/config'
import { overlayCarouselConfig } from '@/lib/blocks/hero-block/templates/carousel-hero/templates/overlay/config'

export const carouselHeroConfig: GroupField = {
  type: 'group',
  label: 'Carousel Hero Content',
  name: 'carouselHeroContent',
  interfaceName: 'CarouselHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'carousel'),
  },
  fields: [
    {
      name: 'carouselTemplate',
      type: 'select',
      label: 'Carousel Template',
      options: carouselOptions,
      required: true,
      defaultValue: 'standard',
    },
    {
      name: 'enableInteraction',
      type: 'checkbox',
      label: 'Enable Interaction',
      defaultValue: true,
      admin: {
        description: 'Shows previous/next navigation arrows.',
      },
    },
    {
      name: 'autoPlay',
      type: 'checkbox',
      label: 'Auto-play',
      defaultValue: true,
    },
    {
      name: 'autoPlayInterval',
      type: 'number',
      label: 'Auto-play Interval (ms)',
      defaultValue: 5000,
      min: 2000,
      max: 15000,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.autoPlay),
        description: 'Time in milliseconds between slide transitions.',
        step: 500,
      },
    },
    standardCarouselConfig,
    overlayCarouselConfig,
  ],
}
