import type { Block } from 'payload'
import { LinkField } from '@/lib/fields/link/LinkField'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const CtaBackgroundV2Block: Block = {
  slug: 'ctaBackgroundV2',
  labels: {
    singular: 'CTA Background (v2)',
    plural: 'CTA Backgrounds (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/cta-background-v2-block-icon.svg',
        alt: 'CTA Background (v2) icon',
      },
      thumbnail: {
        url: '/blocks/cta-background-v2-block-thumbnail.png',
        alt: 'CTA Background (v2) - full-bleed image with framed CTA',
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
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background image',
              required: true,
              admin: {
                description: 'Full-bleed photo behind the framed content.',
              },
            },
            {
              name: 'backgroundAlt',
              type: 'text',
              label: 'Background alt text',
              admin: {
                description: 'Leave empty to use the media library alt text.',
              },
            },
            {
              name: 'heading',
              type: 'text',
              label: 'Heading',
              required: true,
              defaultValue: 'Promotion',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
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
                  defaultValue: 'Get started',
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
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
              admin: {
                description: 'Small line under the button (optional).',
              },
            },
            {
              name: 'overlayOpacity',
              type: 'number',
              label: 'Left overlay opacity',
              min: 0,
              max: 100,
              defaultValue: 50,
              admin: {
                description: 'Dark gradient from the left for text contrast (0–100%).',
              },
            },
          ],
        },
        {
          label: 'Appearance',
          fields: [
            ColorField({
              name: 'frameColor',
              label: 'Frame border color',
              defaultToken: 'background',
              description: 'Colour of the thin frame around the content.',
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
