import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const QuoteV2Block: Block = {
  slug: 'quoteV2',
  labels: {
    singular: 'Quote (v2)',
    plural: 'Quotes (v2)',
  },
  admin: {
    group: 'Elements',
    components: {
      Label: '/lib/blocks/v2/components/BlockTextLabel#BlockTextLabel',
    },
    images: {
      icon: {
        url: '/blocks/quote-v2-block-icon.svg',
        alt: 'Quote (v2) icon',
      },
      thumbnail: {
        url: '/blocks/quote-v2-block-thumbnail.png',
        alt: 'Quote (v2) - pull quote with attribution',
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
              name: 'quote',
              type: 'textarea',
              label: 'Quote',
              required: true,
              admin: {
                description: 'The quotation text (without surrounding quotation marks).',
              },
            },
            {
              name: 'attribution',
              type: 'text',
              label: 'Attribution',
              admin: {
                description: 'Who said it — e.g. a name or role.',
              },
            },
            {
              name: 'source',
              type: 'text',
              label: 'Source',
              admin: {
                description: 'Optional source or publication (shown after the attribution).',
              },
            },
            {
              name: 'align',
              type: 'select',
              label: 'Alignment',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
              ],
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
