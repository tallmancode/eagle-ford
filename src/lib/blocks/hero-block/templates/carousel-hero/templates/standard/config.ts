import type { GroupField } from 'payload'

export const standardCarouselConfig: GroupField = {
  type: 'group',
  label: 'Standard Carousel Content',
  name: 'standardCarouselContent',
  interfaceName: 'StandardCarousel',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.carouselTemplate === 'standard'),
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
  ],
}
