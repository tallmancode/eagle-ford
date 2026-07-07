import type { Block } from 'payload'
import { blockRichTextEditor } from '@/lib/blocks/rich-text-block/blockRichTextEditor'

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'Faq',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  admin: {
    group: 'Text',
    components: {
      Label: '/lib/blocks/faq-block/components/FaqBlockLabel',
    },
    images: {
      thumbnail: {
        url: '/blocks/faq-block.jpg',
        alt: 'FAQ block - accordion list with expandable answers',
      },
    },
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'FAQ Items',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Question',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          label: 'Answer',
          editor: blockRichTextEditor,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Image',
        },
        {
          name: 'imageAlt',
          type: 'text',
          label: 'Image Alt Text',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.image),
            description:
              'Override the alt text from the media library. Leave empty to use the media alt text.',
          },
        },
      ],
    },
  ],
}
