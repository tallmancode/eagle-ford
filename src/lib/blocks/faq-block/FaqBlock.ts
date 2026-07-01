import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  TextStateFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { richTextColorState } from '@/lib/blocks/rich-text-block/richTextColors'

const faqAnswerEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    UnorderedListFeature(),
    OrderedListFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    TextStateFeature({
      state: {
        color: richTextColorState,
      },
    }),
  ],
})

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'Faq',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  admin: {
    components: {
      Label: '/lib/blocks/faq-block/components/FaqBlockLabel',
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
          editor: faqAnswerEditor,
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
