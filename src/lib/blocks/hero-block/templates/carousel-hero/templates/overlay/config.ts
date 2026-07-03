import type { GroupField } from 'payload'

export const overlayCarouselConfig: GroupField = {
  type: 'group',
  label: 'Overlay Carousel Content',
  name: 'overlayCarouselContent',
  interfaceName: 'OverlayCarousel',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.carouselTemplate === 'overlay'),
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
          name: 'heading',
          type: 'text',
          label: 'Heading',
        },
        {
          name: 'subheading',
          type: 'textarea',
          label: 'Subheading',
        },
        {
          name: 'alignment',
          type: 'select',
          label: 'Text Alignment',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
      ],
    },
  ],
}
