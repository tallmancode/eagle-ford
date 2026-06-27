import type { GroupField } from 'payload'

export const fullWidthBannerConfig: GroupField = {
  type: 'group',
  label: 'Full Width Banner Content',
  name: 'fullWidthBannerContent',
  interfaceName: 'FullWidthBanner',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.bannerTemplate === 'full-width'),
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
  ],
}
