import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const SpecialsArchiveV2Block: Block = {
  slug: 'specialsArchiveV2',
  labels: {
    singular: 'Specials Archive (v2)',
    plural: 'Specials Archives (v2)',
  },
  admin: {
    group: 'Archives',
    images: {
      icon: {
        url: '/blocks/specials-archive-v2-block-icon.svg',
        alt: 'Specials Archive (v2) icon',
      },
      thumbnail: {
        url: '/blocks/specials-archive-v2-block-thumbnail.png',
        alt: 'Specials Archive (v2) - specials grouped by category',
      },
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          description:
            'Lists all published specials, grouped by category. Nothing to configure here — use the Layout tab for spacing.',
          fields: [],
        },
        {
          label: 'Layout',
          fields: [StyleFields({ name: 'styles', label: false })],
        },
      ],
    },
  ],
}
