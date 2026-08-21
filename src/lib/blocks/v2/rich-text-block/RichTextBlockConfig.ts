import type { Block } from 'payload'
import { blockRichTextEditor } from '@/lib/blocks/rich-text-block/blockRichTextEditor'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const RichTextV2Block: Block = {
  slug: 'richTextV2',
  labels: {
    singular: 'Rich Text (v2)',
    plural: 'Rich Texts (v2)',
  },
  admin: {
    group: 'Typography',
    components: {
      Label: '/lib/blocks/v2/components/BlockTextLabel#BlockTextLabel',
    },
    images: {
      icon: {
        url: '/blocks/rich-text-v2-block-icon.svg',
        alt: 'Rich Text (v2) icon',
      },
      thumbnail: {
        url: '/blocks/rich-text-v2-block-thumbnail.png',
        alt: 'Rich Text (v2) - Lexical rich text content',
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
              name: 'content',
              type: 'richText',
              required: true,
              editor: blockRichTextEditor,
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
