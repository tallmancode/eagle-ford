import type { GroupField } from 'payload'

export const overlayBannerConfig: GroupField = {
  type: 'group',
  label: 'Overlay Banner Content',
  name: 'overlayBannerContent',
  interfaceName: 'OverlayBanner',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.bannerTemplate === 'overlay'),
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
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Text Alignment',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'darkOverlay',
      type: 'checkbox',
      label: 'Dark Overlay',
      defaultValue: true,
      admin: {
        description: 'Adds a semi-transparent dark tint over the image to improve text legibility.',
      },
    },
  ],
}
