import type { Block } from 'payload'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const FormV2Block: Block = {
  slug: 'formV2',
  labels: {
    singular: 'Form (v2)',
    plural: 'Forms (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/form-v2-block-icon.svg',
        alt: 'Form (v2) icon',
      },
      thumbnail: {
        url: '/blocks/form-v2-block-thumbnail.png',
        alt: 'Form (v2) - Payload form with intro content',
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
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              admin: {
                description: 'Select a form from Forms. Submit, email, and LMS behaviour come from that form.',
              },
            },
            {
              name: 'enableIntro',
              type: 'checkbox',
              label: 'Enable Intro Content',
              defaultValue: false,
            },
            {
              name: 'introContent',
              type: 'richText',
              admin: {
                condition: (_, { enableIntro }) => Boolean(enableIntro),
              },
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                ],
              }),
              label: 'Intro Content',
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
