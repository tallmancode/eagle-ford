import type { Block } from 'payload'

export const WhyCardsBlock: Block = {
  slug: 'why-cards',
  interfaceName: 'WhyCards',
  labels: {
    singular: 'Why Cards',
    plural: 'Why Cards',
  },
  admin: {
    components: {
      Label: '/lib/blocks/why-cards-block/components/WhyCardsBlockLabel',
    },
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          required: true,
          options: [
            { label: 'Trending Up', value: 'trending-up' },
            { label: 'Shield Check', value: 'shield-check' },
            { label: 'Handshake', value: 'handshake' },
            { label: 'Check Circle', value: 'check-circle' },
            { label: 'Star', value: 'star' },
            { label: 'Shield', value: 'shield' },
            { label: 'Car', value: 'car' },
            { label: 'Wrench (Service)', value: 'wrench' },
            { label: 'Info', value: 'info' },
            { label: 'Calendar', value: 'calendar' },
            { label: 'Fuel', value: 'fuel' },
            { label: 'Map Pin (Location)', value: 'map-pin' },
            { label: 'Phone', value: 'phone' },
            { label: 'Mail (Email)', value: 'mail' },
            { label: 'Clock (Hours)', value: 'clock' },
            { label: 'Award', value: 'award' },
            { label: 'Zap', value: 'zap' },
            { label: 'Heart', value: 'heart' },
            { label: 'Thumbs Up', value: 'thumbs-up' },
            { label: 'Dollar Sign', value: 'dollar-sign' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
      ],
    },
  ],
}
