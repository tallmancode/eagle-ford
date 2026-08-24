import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleGalleryV2Block: Block = {
  slug: 'vehicleGalleryV2',
  labels: {
    singular: 'Vehicle Gallery (v2)',
    plural: 'Vehicle Galleries (v2)',
  },
  admin: {
    group: 'Vehicle',
    images: {
      icon: {
        url: '/blocks/vehicle-gallery-v2-block-icon.svg',
        alt: 'Vehicle Gallery (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-gallery-v2-block-thumbnail.png',
        alt: 'Vehicle Gallery (v2) - image carousel with lightbox',
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
              name: 'maxImages',
              type: 'number',
              label: 'Max Images',
              defaultValue: 12,
              min: 1,
              admin: {
                description: 'Maximum number of gallery images to display.',
              },
            },
            {
              name: 'autoplayInterval',
              type: 'number',
              label: 'Autoplay Interval (ms)',
              defaultValue: 0,
              admin: {
                description: 'Reserved; 0 = off',
              },
            },
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
