import type { Block } from 'payload'

export const IconTextBlock: Block = {
  slug: 'icon-text',
  labels: {
    singular: 'Icon Text',
    plural: 'Icon Texts',
  },
  admin: {
    components: {
      Label: '/lib/blocks/icon-text-block/components/IconTextBlockLabel',
    },
  },
  fields: [
    {
      name: 'icon',
      type: 'select',
      label: 'Icon',
      required: true,
      options: [
        { label: 'Map Pin (Location)', value: 'map-pin' },
        { label: 'Phone', value: 'phone' },
        { label: 'Mail (Email)', value: 'mail' },
        { label: 'Clock (Hours)', value: 'clock' },
        { label: 'Car', value: 'car' },
        { label: 'Wrench (Service)', value: 'wrench' },
        { label: 'Check Circle', value: 'check-circle' },
        { label: 'Info', value: 'info' },
        { label: 'Star', value: 'star' },
        { label: 'Calendar', value: 'calendar' },
        { label: 'Shield', value: 'shield' },
        { label: 'Fuel', value: 'fuel' },
      ],
    },
    {
      name: 'text',
      type: 'text',
      label: 'Text',
      required: true,
    },
  ],
}
