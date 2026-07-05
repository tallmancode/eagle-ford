import type { Block } from 'payload'

export const BackButtonBlock: Block = {
  slug: 'back-button',
  labels: {
    singular: 'Back Button',
    plural: 'Back Buttons',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Button Label',
      defaultValue: 'Back',
      required: true,
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
    },
    {
      name: 'fallbackUrl',
      type: 'text',
      label: 'Fallback URL',
      defaultValue: '/',
      admin: {
        description: 'Used when there is no browser history (e.g. direct link or new tab).',
      },
    },
    {
      name: 'showIcon',
      type: 'checkbox',
      label: 'Show back arrow',
      defaultValue: true,
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
