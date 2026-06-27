import type { GroupField } from 'payload'
import headingBlockFields from '@/lib/blocks/heading-block/fields/heading-block-fields'
import { headingMarkupDescription } from '@/lib/blocks/heading-block/utils/headingMarkupDescription'

export const separatorHeadingConfig: GroupField = {
  type: 'group',
  label: 'Separator Heading Content',
  name: 'separatorHeadingContent',
  interfaceName: 'SeparatorHeading',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'separator'),
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
    ...headingBlockFields(),
  ],
}
