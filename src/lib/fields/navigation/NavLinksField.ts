import type { ArrayField, CollectionSlug } from 'payload'

export const NavLinksField = ({
  name,
  maxRows,
  relationTo,
}: {
  name: string
  relationTo: CollectionSlug[]
  maxRows: number
}): ArrayField => ({
  name,
  interfaceName: 'NavLinks',
  type: 'array',
  maxRows,
  admin: {
    isSortable: true,
    components: {
      RowLabel: '/lib/fields/navigation/Components/NavLinkRowLabel',
    },
  },
  fields: [
    {
      name: 'type',
      type: 'radio',
      admin: {
        layout: 'horizontal',
        width: '100%',
      },
      defaultValue: 'reference',
      options: [
        {
          label: 'Internal link',
          value: 'reference',
        },
        {
          label: 'Custom URL',
          value: 'custom',
        },
        {
          label: 'Dropdown',
          value: 'dropdown',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'radio',
          admin: {
            layout: 'horizontal',
            width: '50%',
            condition: (_, siblingData) =>
              siblingData?.type === 'reference' || siblingData?.type === 'custom',
          },
          defaultValue: 'link',
          options: [
            {
              label: 'Link',
              value: 'link',
            },
            {
              label: 'Button',
              value: 'button',
            },
          ],
        },
        {
          name: 'target',
          type: 'radio',
          admin: {
            layout: 'horizontal',
            width: '50%',
            condition: (_, siblingData) =>
              siblingData?.type === 'custom' ||
              (siblingData?.type === 'dropdown' && siblingData?.parentLinkType === 'custom'),
          },
          defaultValue: '_blank',
          options: [
            {
              label: '_blank',
              value: '_blank',
            },
            {
              label: '_self',
              value: '_self',
            },
            {
              label: '_parent',
              value: '_parent',
            },
            {
              label: '_top',
              value: '_top',
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          type: 'text',
          label: 'Label',
          name: 'label',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'reference' ||
              (siblingData?.type === 'dropdown' && siblingData?.parentLinkType === 'reference'),
          },
          label: 'Document to link to',
          maxDepth: 2,
          relationTo: relationTo,
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'custom' ||
              (siblingData?.type === 'dropdown' && siblingData?.parentLinkType === 'custom'),
          },
          label: 'Custom URL',
          required: true,
        },
      ],
    },
    {
      name: 'parentLinkType',
      type: 'radio',
      defaultValue: 'none',
      admin: {
        layout: 'horizontal',
        width: '100%',
        condition: (_, siblingData) => siblingData?.type === 'dropdown',
        description: 'Optional link for the parent menu label',
      },
      options: [
        {
          label: 'No link',
          value: 'none',
        },
        {
          label: 'Internal link',
          value: 'reference',
        },
        {
          label: 'Custom URL',
          value: 'custom',
        },
      ],
    },
    {
      type: 'array',
      name: 'children',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'dropdown',
        components: {
          RowLabel: '/lib/fields/navigation/Components/NavLinkRowLabel',
        },
      },
      fields: [
        {
          name: 'type',
          type: 'radio',
          admin: {
            layout: 'horizontal',
            width: '100%',
          },
          defaultValue: 'reference',
          options: [
            {
              label: 'Internal link',
              value: 'reference',
            },
            {
              label: 'Custom URL',
              value: 'custom',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              type: 'text',
              label: 'Label',
              name: 'label',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'reference',
              type: 'relationship',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
              },
              label: 'Document to link to',
              maxDepth: 2,
              relationTo: relationTo,
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
              },
              label: 'Custom URL',
              required: true,
            },
          ],
        },
      ],
    },
  ],
})
