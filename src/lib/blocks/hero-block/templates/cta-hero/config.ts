import type { GroupField } from 'payload'
import { NavLinksField } from '@/lib/fields/navigation/NavLinksField'

export const ctaHeroConfig: GroupField = {
  type: 'group',
  label: 'CTA Hero Content',
  name: 'ctaHeroContent',
  interfaceName: 'CtaHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'cta'),
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hero Image',
      admin: {
        description:
          'Recommended: vehicle or product on a dark/transparent background for the right side of the banner.',
      },
    },
    {
      type: 'text',
      name: 'heading',
      label: 'Heading',
      required: true,
    },
    {
      type: 'textarea',
      name: 'paragraph',
      label: 'Paragraph',
    },
    NavLinksField({ name: 'cta', maxRows: 1, relationTo: ['pages'] }),
  ],
}
