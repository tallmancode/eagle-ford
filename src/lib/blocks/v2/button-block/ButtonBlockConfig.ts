import type { Block } from 'payload'
import { LucideIconField } from '@/lib/fields/lucide-icons'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

export const ButtonV2Block: Block = {
  slug: 'buttonV2',
  labels: {
    singular: 'Button (v2)',
    plural: 'Buttons (v2)',
  },
  admin: {
    group: 'Elements',
    components: {
      Label: '/lib/blocks/v2/components/BlockTextLabel#BlockTextLabel',
    },
    images: {
      icon: {
        url: '/blocks/button-v2-block-icon.svg',
        alt: 'Button (v2) icon',
      },
      thumbnail: {
        url: '/blocks/button-v2-block-thumbnail.png',
        alt: 'Button (v2) - call-to-action button',
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
              name: 'label',
              type: 'text',
              label: 'Button Label',
              required: true,
            },
            {
              name: 'trackAsCta',
              type: 'checkbox',
              label: 'Track click in Google Tag Manager',
              defaultValue: true,
              admin: {
                description:
                  'On by default. Uncheck to skip the cta_click event for this button. Tracking only runs on the live production site.',
              },
            },
            LucideIconField({ required: false }),
            {
              type: 'row',
              fields: [
                {
                  name: 'linkType',
                  type: 'radio',
                  label: 'Link Type',
                  required: true,
                  defaultValue: 'url',
                  options: [
                    { label: 'URL', value: 'url' },
                    { label: 'Internal link', value: 'reference' },
                    { label: 'Anchor (same page)', value: 'anchor' },
                    { label: 'Browser back', value: 'historyBack' },
                  ],
                  admin: {
                    layout: 'horizontal',
                    width: '50%',
                  },
                },
                {
                  name: 'variant',
                  type: 'select',
                  label: 'Variant',
                  defaultValue: 'default',
                  options: [
                    { label: 'Default', value: 'default' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Ghost', value: 'ghost' },
                    { label: 'Link', value: 'link' },
                    { label: 'White', value: 'white' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              admin: {
                description: 'e.g. /contact, https://example.com, tel:0105971555, mailto:info@example.com',
                condition: (_data, siblingData) => siblingData?.linkType === 'url',
              },
            },
            {
              name: 'reference',
              type: 'relationship',
              label: 'Document to link to',
              relationTo: ['pages'],
              maxDepth: 2,
              required: true,
              admin: {
                condition: (_data, siblingData) => siblingData?.linkType === 'reference',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
              defaultValue: false,
              admin: {
                condition: (_data, siblingData) =>
                  siblingData?.linkType === 'url' || siblingData?.linkType === 'reference',
              },
            },
            {
              name: 'anchorId',
              type: 'text',
              label: 'Anchor Section ID',
              admin: {
                description:
                  'The Section ID of the target section (without #). Set on the target section via its Accessibility settings.',
                condition: (_data, siblingData) => siblingData?.linkType === 'anchor',
              },
            },
            {
              name: 'fallbackUrl',
              type: 'text',
              label: 'Fallback URL',
              defaultValue: '/',
              admin: {
                description:
                  'Used when there is no browser history to go back to (e.g. opened in a new tab).',
                condition: (_data, siblingData) => siblingData?.linkType === 'historyBack',
              },
            },
            {
              name: 'showBackIcon',
              type: 'checkbox',
              label: 'Show back arrow icon',
              defaultValue: true,
              admin: {
                condition: (_data, siblingData) => siblingData?.linkType === 'historyBack',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'size',
                  type: 'select',
                  label: 'Size',
                  defaultValue: 'default',
                  options: [
                    { label: 'Small', value: 'sm' },
                    { label: 'Default', value: 'default' },
                    { label: 'Large', value: 'lg' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'align',
                  type: 'select',
                  label: 'Alignment',
                  defaultValue: 'left',
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                    { label: 'Right', value: 'right' },
                  ],
                  admin: {
                    width: '50%',
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
