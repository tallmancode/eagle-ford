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
            description: 'Desktop / large screens. Recommended: 1920×1080px, WebP or JPEG.',
          },
        },
        {
          name: 'mobileImage',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Mobile Image',
          admin: {
            description:
              'Optional. Used instead of the Background Image when the page loads on a mobile-sized screen (under 768px). If empty, the Background Image is used. Recommended: portrait or square crop, WebP or JPEG.',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          label: 'Link to page or special',
          maxDepth: 2,
          relationTo: ['pages', 'specials', 'special-categories'],
          admin: {
            appearance: 'drawer',
            description:
              'Optional. Makes the slide clickable. Choose a page, a special, or a special category.',
          },
        },
      ],
    },
  ],
}
