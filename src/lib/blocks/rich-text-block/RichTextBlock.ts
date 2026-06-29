import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  TextStateFeature,
} from '@payloadcms/richtext-lexical'
import { richTextColorState } from './richTextColors'

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
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          TextStateFeature({
            state: {
              color: richTextColorState,
            },
          }),
        ],
      }),
    },
  ],
}
