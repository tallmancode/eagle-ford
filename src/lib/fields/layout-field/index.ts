import type { GroupField, LabelFunction, StaticLabel } from 'payload'
import {
  defaultFlexLayoutValue,
  defaultLayoutSpacingForExclude,
  defaultLayoutVisibilityValue,
  validateFlexLayoutValue,
  validateLayoutSpacingValue,
  validateLayoutVisibilityValue,
} from '@/lib/fields/layout-field/utils/layout-utils'

export const LayoutField = ({
  name,
  label = false,
  exclude,
}: {
  name: string
  label?: false | LabelFunction | StaticLabel | undefined
  exclude?: ('padding' | 'margin')[]
}): GroupField => {
  const excludeList = exclude ?? []
  return {
    type: 'group',
    name,
    label,
    fields: [
      {
        type: 'json',
        name: 'spacing',
        label: 'Spacing',
        admin: {
          description: 'Padding and margin per breakpoint (top, right, bottom, left).',
          components: {
            Field: {
              path: '@/lib/fields/layout-field/components/SpacingLayoutField#SpacingLayoutField',
              clientProps: {
                exclude: excludeList,
              },
            },
          },
        },
        defaultValue: defaultLayoutSpacingForExclude(excludeList),
        validate: validateLayoutSpacingValue,
      },
      {
        type: 'json',
        name: 'flex',
        label: 'Flex',
        admin: {
          hidden: true,
        },
        defaultValue: defaultFlexLayoutValue(),
        validate: validateFlexLayoutValue,
      },
      {
        type: 'json',
        name: 'visibility',
        label: 'Visibility',
        admin: {
          description: 'Hide this section at specific screen sizes.',
          components: {
            Field: {
              path: '@/lib/fields/layout-field/components/VisibilityLayoutField#VisibilityLayoutField',
            },
          },
        },
        defaultValue: defaultLayoutVisibilityValue(),
        validate: validateLayoutVisibilityValue,
      },
    ],
  }
}
