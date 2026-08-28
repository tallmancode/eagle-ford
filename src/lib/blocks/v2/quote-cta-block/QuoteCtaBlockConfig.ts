import type { Block } from 'payload'
import { LinkField } from '@/lib/fields/link/LinkField'
import { ColorField } from '@/lib/blocks/v2/fields/color'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const QuoteCtaV2Block: Block = {
  slug: 'quoteCtaV2',
  labels: {
    singular: 'Quote CTA (v2)',
    plural: 'Quote CTAs (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/quote-cta-v2-block-icon.svg',
        alt: 'Quote CTA (v2) icon',
      },
      thumbnail: {
        url: '/blocks/quote-cta-v2-block-thumbnail.png',
        alt: 'Quote CTA (v2) - end-of-page quote with image and button',
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
              name: 'quote',
              type: 'textarea',
              label: 'Quote',
              required: true,
              defaultValue: 'Quality means doing it right when no one is looking',
              admin: {
                description: 'Large quote text. This is an end-of-page CTA — not a site footer.',
              },
            },
            {
              name: 'attribution',
              type: 'text',
              label: 'Attribution',
              defaultValue: '– Henry Ford',
              admin: {
                description: 'Optional attribution under the quote.',
              },
            },
            {
              name: 'body',
              type: 'textarea',
              label: 'Supporting text',
              admin: {
                description: 'Paragraph under the quote, above the button.',
              },
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
                  defaultValue: 'Contact For Queries',
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
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Side image',
              required: true,
              admin: {
                description: 'Large vehicle (or lifestyle) image on the right.',
              },
            },
            {
              name: 'imageAlt',
              type: 'text',
              label: 'Image alt text',
            },
          ],
        },
        {
          label: 'Appearance',
          fields: [
            ColorField({
              name: 'backgroundColor',
              label: 'Background color',
              defaultToken: 'foreground',
              description: 'Dark band behind the quote and image.',
            }),
            ColorField({
              name: 'quoteColor',
              label: 'Quote color',
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
