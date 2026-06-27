import type { GroupField } from 'payload'
import { headingMarkupDescription } from '@/lib/blocks/heading-block/utils/headingMarkupDescription'

export const headlineHeroConfig: GroupField = {
  type: 'group',
  label: 'Headline Hero Content',
  name: 'headlineHeroContent',
  interfaceName: 'HeadlineHero',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'headline'),
  },
  fields: [
    {
      type: 'text',
      name: 'mainHeading',
      label: 'Main Heading',
      required: true,
      admin: {
        description: headingMarkupDescription,
      },
    },
    {
      type: 'text',
      name: 'subHeading',
      label: 'Sub Heading',
    },
  ],
}
