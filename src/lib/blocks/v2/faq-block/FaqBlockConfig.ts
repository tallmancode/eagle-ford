import type { Block } from 'payload'
import { blockRichTextEditor } from '@/lib/blocks/rich-text-block/blockRichTextEditor'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const FaqV2Block: Block = {
  slug: 'faqV2',
  labels: {
    singular: 'FAQ (v2)',
    plural: 'FAQs (v2)',
  },
  admin: {
    group: 'Text',
    images: {
      icon: {
        url: '/blocks/faq-v2-block-icon.svg',
        alt: 'FAQ (v2) icon',
      },
      thumbnail: {
        url: '/blocks/faq-v2-block-thumbnail.png',
        alt: 'FAQ (v2) - accordion list with expandable answers',
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
        },
        {
          label: 'Layout',
          fields: [StyleFields({ name: 'styles', label: false })],
        },
      ],
    },
  ],
}
