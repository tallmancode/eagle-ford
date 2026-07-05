import type { CollectionSlug, GroupField } from 'payload'

type LinkFieldOptions = {
  name: string
  relationTo: CollectionSlug[]
  label?: string
  includeLabel?: boolean
}

export const LinkField = ({
  name,
  relationTo,
  label = 'Link',
  includeLabel = true,
}: LinkFieldOptions): GroupField => ({
  name,
  type: 'group',
  label,
  admin: {
    hideGutter: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Internal link', value: 'reference' },
            { label: 'Custom URL', value: 'custom' },
          ],
          defaultValue: 'reference',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo,
      maxDepth: 1,
      admin: {
        condition: (_data, siblingData) => siblingData?.type !== 'custom',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Custom URL',
      admin: {
        condition: (_data, siblingData) => siblingData?.type === 'custom',
      },
    },
    ...(includeLabel
      ? [
          {
            name: 'label',
            type: 'text' as const,
            label: 'Label',
          },
        ]
      : []),
  ],
})
