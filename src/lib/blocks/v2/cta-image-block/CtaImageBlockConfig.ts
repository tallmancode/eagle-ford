import type { Block } from 'payload'
import { LinkField } from '@/lib/fields/link/LinkField'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const CtaImageV2Block: Block = {
  slug: 'ctaImageV2',
  labels: {
    singular: 'CTA Image (v2)',
    plural: 'CTA Images (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/cta-image-v2-block-icon.svg',
        alt: 'CTA Image (v2) icon',
      },
      thumbnail: {
        url: '/blocks/cta-image-v2-block-thumbnail.png',
        alt: 'CTA Image (v2) - media panel with checklist and button',
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
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Media image',
              required: true,
              admin: {
                description: 'Large image on the left (or video poster).',
              },
            },
            {
              name: 'imageAlt',
              type: 'text',
              label: 'Image alt text',
            },
            {
              name: 'showPlayButton',
              type: 'checkbox',
              label: 'Show play button',
              defaultValue: false,
              admin: {
                description: 'Overlay a circular play control on the image.',
              },
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'Video URL',
              admin: {
                description: 'Optional YouTube/Vimeo/file URL opened when the play button is clicked.',
                condition: (_data, siblingData) => Boolean(siblingData?.showPlayButton),
              },
            },
            {
              name: 'heading',
              type: 'textarea',
              label: 'Heading',
              required: true,
              defaultValue: 'Get A Fair Price For Your Car\nSell To Us Today',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'checklist',
              type: 'array',
              label: 'Checklist',
              labels: {
                singular: 'Item',
                plural: 'Items',
              },
              admin: {
                description: 'Bullet points with checkmarks under the description.',
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  required: true,
                },
              ],
            },
            {
              type: 'group',
              name: 'cta',
              label: 'Call to action',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button label',
                  defaultValue: 'Get Started',
                },
                LinkField({
                  name: 'link',
                  relationTo: ['pages'],
                  includeLabel: false,
                  label: 'Link',
                }),
              ],
            },
            {
              name: 'mediaSide',
              type: 'select',
              label: 'Media side',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        },
        {
          label: 'Appearance',
          fields: [
            ColorField({
              name: 'panelColor',
              label: 'Content panel background',
              defaultToken: 'background',
            }),
            ColorField({
              name: 'buttonColor',
              label: 'Button background',
              defaultToken: 'primary',
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
