import type { Block } from 'payload'
import { LinkField } from '@/lib/fields/link/LinkField'

export const CtaCardsBlock: Block = {
  slug: 'cta-cards',
  interfaceName: 'CtaCards',
  labels: {
    singular: 'CTA Cards',
    plural: 'CTA Cards',
  },
  admin: {
    group: 'Cards',
    components: {
      Label: '/lib/blocks/cta-cards-block/components/CtaCardsBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/cta-cards-block.jpg',
        alt: 'CTA Cards block - grid of cards with outline buttons',
      },
    },
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          required: true,
        },
        LinkField({ name: 'link', relationTo: ['pages'], includeLabel: false }),
      ],
    },
  ],
}
