import type { Block } from 'payload'
import { StyleFields } from '@/lib/blocks/v2/fields/style-fields'

const dayPresets = [
  { label: 'Monday – Friday', value: 'Monday – Friday' },
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
  { label: 'Custom…', value: 'custom' },
]

export const HoursTabsV2Block: Block = {
  slug: 'hoursTabsV2',
  labels: {
    singular: 'Hours Tabs (v2)',
    plural: 'Hours Tabs (v2)',
  },
  admin: {
    group: 'Tabbed Content',
    images: {
      icon: {
        url: '/blocks/hours-tabs-v2-block-icon.svg',
        alt: 'Hours Tabs (v2) icon',
      },
      thumbnail: {
        url: '/blocks/hours-tabs-v2-block-thumbnail.png',
        alt: 'Hours Tabs (v2) - department tabs with hours table',
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
                      name: 'dayPreset',
                      type: 'select',
                      label: 'Day / Range',
                      defaultValue: 'Monday – Friday',
                      options: dayPresets,
                      required: true,
                    },
                    {
                      name: 'dayCustom',
                      type: 'text',
                      label: 'Custom Day Label',
                      admin: {
                        condition: (_data, siblingData) => siblingData?.dayPreset === 'custom',
                      },
                    },
                    {
                      name: 'closed',
                      type: 'checkbox',
                      label: 'Closed',
                      defaultValue: false,
                    },
                    {
                      name: 'hours',
                      type: 'text',
                      label: 'Hours',
                      admin: {
                        description: 'e.g. 08h00–17h30',
                        condition: (_data, siblingData) => !siblingData?.closed,
                      },
                    },
                  ],
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
