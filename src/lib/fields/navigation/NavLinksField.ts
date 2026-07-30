import type { ArrayField, CollectionSlug, Field } from 'payload'

const typeOptions = (enableUploadLink?: boolean) => {
  const options = [
    { label: 'Internal link', value: 'reference' },
    { label: 'Custom URL', value: 'custom' },
    { label: 'Dropdown', value: 'dropdown' },
    { label: 'Vehicle Mega Menu', value: 'vehicleMegaMenu' },
  ]

  if (enableUploadLink) {
    options.push({ label: 'Document', value: 'upload' })
  }

  return options
}

export const NavLinksField = ({
  name,
  maxRows,
  relationTo,
  enableUploadLink,
}: {
  name: string
  relationTo: CollectionSlug[]
  maxRows: number
  enableUploadLink?: boolean
}): ArrayField => {
  const linkRowFields: Field[] = [
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
          (siblingData?.type === 'dropdown' && siblingData?.parentLinkType === 'reference') ||
          (siblingData?.type === 'vehicleMegaMenu' && siblingData?.parentLinkType === 'reference'),
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
          (siblingData?.type === 'dropdown' && siblingData?.parentLinkType === 'custom') ||
          (siblingData?.type === 'vehicleMegaMenu' && siblingData?.parentLinkType === 'custom'),
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (enableUploadLink) {
    linkRowFields.push({
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      label: 'Document',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'upload',
      },
    })
  }

  return {
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
        options: typeOptions(enableUploadLink),
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
                (siblingData?.type === 'dropdown' && siblingData?.parentLinkType === 'custom') ||
                (siblingData?.type === 'vehicleMegaMenu' &&
                  siblingData?.parentLinkType === 'custom'),
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
        fields: linkRowFields,
      },
      {
        name: 'parentLinkType',
        type: 'radio',
        defaultValue: 'none',
        admin: {
          layout: 'horizontal',
          width: '100%',
          condition: (_, siblingData) =>
            siblingData?.type === 'dropdown' || siblingData?.type === 'vehicleMegaMenu',
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
  }
}
