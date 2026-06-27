import type { GroupField } from 'payload'
import headingBlockFields from '@/lib/blocks/heading-block/fields/heading-block-fields'
import { headingMarkupDescription } from '@/lib/blocks/heading-block/utils/headingMarkupDescription'

export const swipeHeadingConfig: GroupField = {
  type: 'group',
  label: 'Swipe Heading Content',
  name: 'swipeHeadingContent',
  interfaceName: 'SwipeHeading',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'swipe'),
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      admin: {
        description: headingMarkupDescription,
      },
    },
    {
      name: 'barColor',
      type: 'text',
      label: 'Bar Color',
      defaultValue: '#000000',
      admin: {
        description: 'Hex color for the reveal bar (e.g. #FF0000)',
      },
    },
    ...headingBlockFields(),
  ],
}
