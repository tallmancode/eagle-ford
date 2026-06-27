import type { GroupField } from 'payload'

export const videoBannerHeroConfig: GroupField = {
  type: 'group',
  label: 'Video Banner Hero Content',
  name: 'videoBannerHeroContent',
  interfaceName: 'VideoBannerHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'video-banner'),
  },
  fields: [
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Banner Video',
      filterOptions: {
        mimeType: { contains: 'video' },
      },
      admin: {
        description: 'Recommended: MP4 or WebM, wide format (e.g. 1920×600).',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Poster Image',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        description: 'Shown until the page has fully loaded, then replaced by autoplaying video.',
      },
    },
    {
      name: 'loop',
      type: 'checkbox',
      label: 'Loop Video',
      defaultValue: true,
    },
  ],
}
