import type { Block } from 'payload'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const AsymmetricMediaStoryV2Block: Block = {
  slug: 'asymmetricMediaStoryV2',
  labels: {
    singular: 'Asymmetric Media Story (v2)',
    plural: 'Asymmetric Media Stories (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/asymmetric-media-story-v2-block-icon.svg',
        alt: 'Asymmetric Media Story (v2) icon',
      },
      thumbnail: {
        url: '/blocks/asymmetric-media-story-v2-block-thumbnail.png',
        alt: 'Asymmetric Media Story (v2) - eyebrow, heading, large image left; two images and body right',
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
              name: 'eyebrow',
              type: 'text',
              label: 'Eyebrow',
              admin: {
                description: 'Small accent line above the heading (left column).',
              },
            },
            {
              name: 'heading',
              type: 'textarea',
              label: 'Heading',
              required: true,
              admin: {
                description: 'Main heading in the left column, above the large image.',
              },
            },
            {
              name: 'text',
              type: 'textarea',
              label: 'Text',
              required: true,
              admin: {
                description: 'Body copy in the right column, below the two smaller images.',
              },
            },
            {
              name: 'image1',
              type: 'upload',
              relationTo: 'media',
              label: 'Large Image',
              required: true,
              admin: {
                description:
                  'Portrait image at the bottom of the left column (under eyebrow and heading).',
              },
            },
            {
              name: 'image1Alt',
              type: 'text',
              label: 'Large Image Alt Text',
              admin: {
                description:
                  'Override the alt text from the media library. Leave empty to use the media alt text.',
              },
            },
            {
              name: 'image2',
              type: 'upload',
              relationTo: 'media',
              label: 'Medium Image',
              required: true,
              admin: {
                description: 'Medium image in the right column image row (left of the small image).',
              },
            },
            {
              name: 'image2Alt',
              type: 'text',
              label: 'Medium Image Alt Text',
              admin: {
                description:
                  'Override the alt text from the media library. Leave empty to use the media alt text.',
              },
            },
            {
              name: 'image3',
              type: 'upload',
              relationTo: 'media',
              label: 'Small Image',
              required: true,
              admin: {
                description: 'Smaller image in the right column image row (right of the medium image).',
              },
            },
            {
              name: 'image3Alt',
              type: 'text',
              label: 'Small Image Alt Text',
              admin: {
                description:
                  'Override the alt text from the media library. Leave empty to use the media alt text.',
              },
            },
          ],
        },
        {
          label: 'Appearance',
          description: 'Colours for copy. Leave empty to use the site defaults.',
          fields: [
            ColorField({
              name: 'eyebrowColor',
              label: 'Eyebrow color',
              defaultToken: 'danger',
              description: 'Colour of the eyebrow text.',
            }),
            ColorField({
              name: 'headingColor',
              label: 'Heading color',
              defaultToken: 'foreground',
              description: 'Colour of the heading.',
            }),
            ColorField({
              name: 'textColor',
              label: 'Text color',
              defaultToken: 'muted',
              description: 'Colour of the body text.',
            }),
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
