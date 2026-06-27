import type { GroupField } from 'payload'

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
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      maxRows: 8,
      required: true,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Background Image',
          admin: {
            description: 'Recommended: 1920×1080px, WebP or JPEG.',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          label: 'Document to link to',
          maxDepth: 2,
          relationTo: ['pages'],
        },
      ],
    },
    {
      name: 'enableInteraction',
      type: 'checkbox',
      label: 'Enable Interaction',
      defaultValue: true,
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
  ],
}
