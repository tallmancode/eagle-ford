import type { Block } from 'payload'
import { blockRichTextEditor } from '@/lib/blocks/rich-text-block/blockRichTextEditor'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const AccordionV2Block: Block = {
  slug: 'accordionV2',
  labels: {
    singular: 'Accordion (v2)',
    plural: 'Accordions (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/accordion-v2-block-icon.svg',
        alt: 'Accordion (v2) icon',
      },
      thumbnail: {
        url: '/blocks/accordion-v2-block-thumbnail.png',
        alt: 'Accordion (v2) - expandable FAQ items',
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
              name: 'items',
              type: 'array',
              label: 'Items',
              minRows: 1,
              required: true,
              admin: {
                description: 'Each item has a title and expandable rich-text content.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'content',
                  type: 'richText',
                  label: 'Content',
                  editor: blockRichTextEditor,
                },
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
