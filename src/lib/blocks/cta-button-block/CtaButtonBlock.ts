import type { Block } from 'payload'

export const CtaButtonBlock: Block = {
  slug: 'cta-button',
  labels: {
    singular: 'CTA Button',
    plural: 'CTA Buttons',
  },
  admin: {
    images: {
      thumbnail: {
        url: '/blocks/cta-button-block.jpg',
        alt: 'CTA Button block - single call-to-action button',
      },
    },
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Button Label',
      required: true,
    },
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
}
