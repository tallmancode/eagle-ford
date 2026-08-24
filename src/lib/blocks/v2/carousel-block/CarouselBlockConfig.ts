import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const CarouselV2Block: Block = {
  slug: 'carouselV2',
  labels: {
    singular: 'Carousel (v2)',
    plural: 'Carousels (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/carousel-v2-block-icon.svg',
        alt: 'Carousel (v2) icon',
      },
      thumbnail: {
        url: '/blocks/carousel-v2-block-thumbnail.png',
        alt: 'Carousel (v2) - sliding image gallery with arrows',
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
              name: 'slides',
              type: 'array',
              label: 'Slides',
              minRows: 1,
              required: true,
              admin: {
                description: 'Each slide is an image. Optional caption and link.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: true,
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
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Caption',
                  admin: {
                    description: 'Optional caption shown under the slide.',
                  },
                },
                {
                  name: 'linkUrl',
                  type: 'text',
                  label: 'Link URL',
                  admin: {
                    description: 'Optional. Makes the slide clickable (e.g. /specials or https://…).',
                  },
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  label: 'Open link in new tab',
                  defaultValue: false,
                  admin: {
                    condition: (_data, siblingData) => Boolean(siblingData?.linkUrl),
                  },
                },
              ],
            },
            {
              name: 'autoPlay',
              type: 'checkbox',
              label: 'Auto-play',
              defaultValue: true,
            },
            {
              name: 'autoPlayInterval',
              type: 'number',
              label: 'Auto-play Interval (ms)',
              defaultValue: 5000,
              min: 2000,
              max: 15000,
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.autoPlay),
                description: 'Time in milliseconds between slide transitions.',
                step: 500,
              },
            },
            {
              name: 'showArrows',
              type: 'checkbox',
              label: 'Show arrows',
              defaultValue: true,
              admin: {
                description: 'Previous/next navigation arrows.',
              },
            },
            {
              name: 'showDots',
              type: 'checkbox',
              label: 'Show dots',
              defaultValue: true,
              admin: {
                description: 'Slide indicator dots below the carousel.',
              },
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
