import type { GroupField } from 'payload'

export const portraitPunchHeroConfig: GroupField = {
  type: 'group',
  label: 'Portrait Punch Hero Content',
  name: 'portraitPunchHeroContent',
  interfaceName: 'PortraitPunchHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'portrait-punch'),
  },
  fields: [
    {
      type: 'text',
      name: 'heading',
      label: 'Heading',
      required: true,
    },
    {
      type: 'textarea',
      name: 'subheading',
      label: 'Subheading',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Portrait Image',
      admin: {
        description: 'Recommended: portrait format (e.g. 3:4 ratio, ~800×1066px), WebP or JPEG.',
      },
    },
    {
      type: 'select',
      name: 'overlayColor',
      label: 'Image Overlay Color',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
      ],
    },
    {
      type: 'number',
      name: 'overlayOpacity',
      label: 'Overlay Opacity (0–100)',
      defaultValue: 30,
      min: 0,
      max: 100,
      admin: {
        description: 'Percentage opacity of the overlay. Only applied when a color is selected.',
        condition: (_, siblingData) =>
          siblingData?.overlayColor && siblingData.overlayColor !== 'none',
      },
    },
  ],
}
