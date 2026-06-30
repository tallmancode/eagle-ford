import type { Block } from 'payload'

export const StatsBlock: Block = {
  slug: 'statsBlock',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Stats',
    plural: 'Stats',
  },
  admin: {
    components: {
      Label: '/lib/blocks/stats-block/components/StatsBlockLabel',
    },
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Stats',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
      ],
    },
  ],
}
