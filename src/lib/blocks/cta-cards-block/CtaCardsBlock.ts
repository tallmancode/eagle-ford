import type { Block } from 'payload'

export const CtaCardsBlock: Block = {
  slug: 'cta-cards',
  interfaceName: 'CtaCards',
  labels: {
    singular: 'CTA Cards',
    plural: 'CTA Cards',
  },
  admin: {
    components: {
      Label: '/lib/blocks/cta-cards-block/components/CtaCardsBlockLabel',
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
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            description: 'e.g. /new/, /showroom/, https://example.com',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
  ],
}
