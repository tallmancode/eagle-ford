import type { GroupField } from 'payload'
import headingBlockFields from '@/lib/blocks/heading-block/fields/heading-block-fields'
import { headingMarkupDescription } from '@/lib/blocks/heading-block/utils/headingMarkupDescription'

export const dashHeadingConfig: GroupField = {
  type: 'group',
  label: 'Dash Heading Content',
  name: 'dashHeadingContent',
  interfaceName: 'DashHeading',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'dash'),
  },
  fields: [
    {
      name: 'tag',
      type: 'text',
      label: 'Tag',
      required: true,
    },
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
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      admin: {
        description: headingMarkupDescription,
      },
    },
    ...headingBlockFields(),
  ],
}
