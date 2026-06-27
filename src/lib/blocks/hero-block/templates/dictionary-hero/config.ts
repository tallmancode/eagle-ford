import type { GroupField } from 'payload'

export const dictionaryHeroConfig: GroupField = {
  type: 'group',
  label: 'Dictionary Hero Content',
  name: 'dictionaryHeroContent',
  interfaceName: 'DictionaryHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'dictionary'),
  },
  fields: [
    {
      name: 'mainImage',
      type: 'upload',
      label: 'Background Image',
      relationTo: 'media',
      hasMany: false,
    },
    {
      type: 'text',
      name: 'mainHeading',
      label: 'Main Heading',
    },
    {
      type: 'text',
      name: 'subHeading',
      label: 'Sub Heading',
    },
    {
      type: 'array',
      name: 'definitions',
      label: 'Definitions',
      fields: [
        {
          type: 'text',
          name: 'text',
          label: 'Definition',
        },
      ],
    },
    {
      type: 'text',
      name: 'exampleText',
      label: 'Example Text',
    },
  ],
}
