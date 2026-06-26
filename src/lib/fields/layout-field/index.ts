import type { GroupField, LabelFunction, StaticLabel } from 'payload'
import {
  defaultLayoutSpacingForExclude,
  validateLayoutSpacingValue,
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
    ],
  }
}
