import type { Block } from 'payload'

export const HoursTabsBlock: Block = {
  slug: 'hours-tabs',
  interfaceName: 'HoursTabs',
  labels: {
    singular: 'Hours Tabs',
    plural: 'Hours Tabs',
  },
  admin: {
    components: {
      Label: '/lib/blocks/hours-tabs-block/components/HoursTabsBlockLabel',
    },
  },
  fields: [
    {
      name: 'departments',
      type: 'array',
      label: 'Departments',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Tab Label',
          required: true,
        },
        {
          name: 'rows',
          type: 'array',
          label: 'Hours',
          minRows: 1,
          required: true,
          fields: [
            {
              name: 'day',
              type: 'text',
              label: 'Day / Range',
              required: true,
            },
            {
              name: 'hours',
              type: 'text',
              label: 'Hours',
              required: true,
              admin: {
                description: 'Enter exactly "Closed" to apply muted styling.',
              },
            },
          ],
        },
      ],
    },
  ],
}
