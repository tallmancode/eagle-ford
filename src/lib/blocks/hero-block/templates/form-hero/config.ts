import type { GroupField } from 'payload'

export const formHeroConfig: GroupField = {
  type: 'group',
  label: 'Form Banner Content',
  name: 'formHeroContent',
  interfaceName: 'FormHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'form'),
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Banner Image',
      admin: {
        description: 'Recommended: wide format (e.g. 1920×600px), WebP or JPEG.',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      label: 'Form',
      admin: {
        description:
          'Choose the form to show on the banner. Works best as a single-step form (name, email, phone, message, subscribe).',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        description: 'Shown above the form (e.g. CONTACT US). Leave blank to use the form title.',
      },
    },
  ],
}
