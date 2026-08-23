import type { Block } from 'payload'
import { blockRichTextEditor } from '@/lib/blocks/rich-text-block/blockRichTextEditor'
import { LucideIconField } from '@/lib/fields/lucide-icons'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const CardV2Block: Block = {
  slug: 'cardV2',
  labels: {
    singular: 'Card (v2)',
    plural: 'Cards (v2)',
  },
  admin: {
    group: 'Elements',
    images: {
      icon: {
        url: '/blocks/card-v2-block-icon.svg',
        alt: 'Card (v2) icon',
      },
      thumbnail: {
        url: '/blocks/card-v2-block-thumbnail.png',
        alt: 'Card (v2) - image, title, body and optional button',
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
              label: 'Image',
              admin: {
                description: 'Optional image shown at the top of the card.',
              },
            },
            {
              name: 'imageAlt',
              type: 'text',
              label: 'Image Alt Text',
              admin: {
                condition: (_data, siblingData) => Boolean(siblingData?.image),
                description: 'Leave empty to use the media library alt text.',
              },
            },
            LucideIconField({
              required: false,
            }),
            {
              name: 'title',
              type: 'text',
              label: 'Title',
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Body',
              editor: blockRichTextEditor,
            },
            {
              name: 'enableCardLink',
              type: 'checkbox',
              label: 'Make whole card a link',
              defaultValue: false,
              admin: {
                description:
                  'When enabled, clicking the image or title navigates to the card link. The button below can still be shown separately.',
              },
            },
            {
              name: 'cardLinkType',
              type: 'radio',
              label: 'Card Link Type',
              defaultValue: 'url',
              options: [
                { label: 'URL', value: 'url' },
                { label: 'Internal link', value: 'reference' },
              ],
              admin: {
                layout: 'horizontal',
                condition: (_data, siblingData) => Boolean(siblingData?.enableCardLink),
              },
            },
            {
              name: 'cardUrl',
              type: 'text',
              label: 'Card URL',
              admin: {
                description: 'e.g. /contact or https://example.com',
                condition: (_data, siblingData) =>
                  Boolean(siblingData?.enableCardLink) && siblingData?.cardLinkType === 'url',
              },
            },
            {
              name: 'cardReference',
              type: 'relationship',
              label: 'Card Page',
              relationTo: ['pages'],
              maxDepth: 2,
              admin: {
                condition: (_data, siblingData) =>
                  Boolean(siblingData?.enableCardLink) && siblingData?.cardLinkType === 'reference',
              },
            },
            {
              name: 'cardNewTab',
              type: 'checkbox',
              label: 'Open card link in new tab',
              defaultValue: false,
              admin: {
                condition: (_data, siblingData) => Boolean(siblingData?.enableCardLink),
              },
            },
            {
              name: 'showButton',
              type: 'checkbox',
              label: 'Show button',
              defaultValue: false,
              admin: {
                description: 'Add a call-to-action button at the bottom of the card.',
              },
            },
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Button Label',
              admin: {
                condition: (_data, siblingData) => Boolean(siblingData?.showButton),
              },
            },
            {
              name: 'buttonLinkType',
              type: 'radio',
              label: 'Button Link Type',
              defaultValue: 'url',
              options: [
                { label: 'URL', value: 'url' },
                { label: 'Internal link', value: 'reference' },
              ],
              admin: {
                layout: 'horizontal',
                condition: (_data, siblingData) => Boolean(siblingData?.showButton),
              },
            },
            {
              name: 'buttonUrl',
              type: 'text',
              label: 'Button URL',
              admin: {
                description: 'e.g. /contact or https://example.com',
                condition: (_data, siblingData) =>
                  Boolean(siblingData?.showButton) && siblingData?.buttonLinkType === 'url',
              },
            },
            {
              name: 'buttonReference',
              type: 'relationship',
              label: 'Button Page',
              relationTo: ['pages'],
              maxDepth: 2,
              admin: {
                condition: (_data, siblingData) =>
                  Boolean(siblingData?.showButton) && siblingData?.buttonLinkType === 'reference',
              },
            },
            {
              name: 'buttonNewTab',
              type: 'checkbox',
              label: 'Open button in new tab',
              defaultValue: false,
              admin: {
                condition: (_data, siblingData) => Boolean(siblingData?.showButton),
              },
            },
            {
              name: 'buttonVariant',
              type: 'select',
              label: 'Button Variant',
              defaultValue: 'default',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Outline', value: 'outline' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Ghost', value: 'ghost' },
                { label: 'Link', value: 'link' },
              ],
              admin: {
                condition: (_data, siblingData) => Boolean(siblingData?.showButton),
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
