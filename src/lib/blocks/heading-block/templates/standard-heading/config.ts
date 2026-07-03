import type { GroupField } from 'payload'
import headingBlockFields from '@/lib/blocks/heading-block/fields/heading-block-fields'
import { headingMarkupDescription } from '@/lib/blocks/heading-block/utils/headingMarkupDescription'

export const standardHeadingConfig: GroupField = {
  type: 'group',
  label: 'Standard Heading Content',
  name: 'standardHeadingContent',
  interfaceName: 'StandardHeading',
  admin: {
    condition: (_, siblingData) => Boolean(siblingData?.template === 'standard'),
  },
  fields: [
    {
      name: 'tag',
      type: 'group',
      label: 'Tag',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
        },
        {
          name: 'style',
          type: 'select',
          label: 'Style',
          defaultValue: 'filled',
          options: [
            { label: 'Filled', value: 'filled' },
            { label: 'Outline', value: 'outline' },
            { label: 'None', value: 'none' },
          ],
        },
        {
          name: 'color',
          type: 'select',
          label: 'Color',
          defaultValue: 'neutral',
          admin: {
            condition: (_, siblingData) => siblingData?.style === 'none',
          },
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Success', value: 'success' },
            { label: 'Danger', value: 'danger' },
            { label: 'Warning', value: 'warning' },
            { label: 'White', value: 'white' },
          ],
        },
      ],
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
      name: 'splitTextAnimation',
      type: 'checkbox',
      label: 'Split text animation',
      defaultValue: false,
      admin: {
        description: 'Animates the main heading with a word-by-word reveal.',
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
