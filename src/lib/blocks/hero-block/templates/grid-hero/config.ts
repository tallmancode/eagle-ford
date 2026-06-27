import type { GroupField } from 'payload'

export const gridHeroConfig: GroupField = {
  type: 'group',
  label: 'Grid Hero Content',
  name: 'gridHeroContent',
  interfaceName: 'GridHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'grid'),
  },
  fields: [
    {
      type: 'text',
      name: 'mainHeading',
      label: 'Main Heading',
      required: true,
    },
    {
      type: 'text',
      name: 'subHeading',
      label: 'Sub Heading',
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
    },
  ],
}
