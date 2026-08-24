import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const VehicleFaqV2Block: Block = {
  slug: 'vehicleFaqV2',
  labels: {
    singular: 'Vehicle FAQ (v2)',
    plural: 'Vehicle FAQs (v2)',
  },
  admin: {
    group: 'Vehicle',
    images: {
      icon: {
        url: '/blocks/vehicle-faq-v2-block-icon.svg',
        alt: 'Vehicle FAQ (v2) icon',
      },
      thumbnail: {
        url: '/blocks/vehicle-faq-v2-block-thumbnail.png',
        alt: 'Vehicle FAQ (v2) - accordion FAQ list',
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
              name: 'heading',
              type: 'text',
              label: 'Heading',
              admin: {
                description: 'Optional heading. Leave empty to use "Frequently Asked Questions".',
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
