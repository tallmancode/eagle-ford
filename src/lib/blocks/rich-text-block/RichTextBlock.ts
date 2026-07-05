import type { Block } from 'payload'
import { blockRichTextEditor } from './blockRichTextEditor'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text',
  },
  admin: {
    components: {
      Label: '/lib/blocks/rich-text-block/components/RichTextBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/rich-text-block.jpg',
        alt: 'Rich Text block - heading and paragraph content',
      },
    },
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: blockRichTextEditor,
    },
  ],
}
