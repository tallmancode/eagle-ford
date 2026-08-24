import type { GroupField, LabelFunction, StaticLabel } from 'payload'
import type { StyleFieldKey } from '@/lib/blocks/v2/types'
import {
  getV2BlockBoxDefault,
  getV2BlockContainerDefault,
  getV2BlockContainerEnabled,
  type V2BlockConfigKey,
} from '@/lib/blocks/v2/blocks-config'
import { PaddingField } from '@/lib/blocks/v2/fields/padding'
import { MarginField } from '@/lib/blocks/v2/fields/margin'
import { InsetField } from '@/lib/blocks/v2/fields/inset'
import { GapField } from '@/lib/blocks/v2/fields/gap'
import { DisplayField } from '@/lib/blocks/v2/fields/display'
import { PositionField } from '@/lib/blocks/v2/fields/position'
import { OverflowField } from '@/lib/blocks/v2/fields/overflow'
import { VisibilityField } from '@/lib/blocks/v2/fields/visibility'
import { ContainerField } from '@/lib/blocks/v2/fields/container'
import { ColorField } from '@/lib/blocks/v2/fields/color'

/** Default layout fields for most v2 blocks. `container` is Section/Wrapper only. */
export const STYLE_FIELD_KEYS: StyleFieldKey[] = [
  'padding',
  'margin',
  'inset',
  'gap',
  'display',
  'position',
  'backgroundColor',
  'overflow',
  'visibility',
]

function buildField(key: StyleFieldKey, block?: V2BlockConfigKey) {
  switch (key) {
    case 'padding':
      return PaddingField(
        block
          ? { defaultValue: () => getV2BlockBoxDefault(block, 'padding') }
          : undefined,
      )
    case 'margin':
      return MarginField(
        block
          ? { defaultValue: () => getV2BlockBoxDefault(block, 'margin') }
          : undefined,
      )
    case 'inset':
      return InsetField(
        block
          ? { defaultValue: () => getV2BlockBoxDefault(block, 'inset') }
          : undefined,
      )
    case 'gap':
      return GapField()
    case 'display':
      return DisplayField()
    case 'position':
      return PositionField()
    case 'container':
      return ContainerField(
        block
          ? {
              defaults: { enabled: getV2BlockContainerEnabled(block) },
              defaultValue: () => getV2BlockContainerDefault(block),
            }
          : undefined,
      )
    case 'backgroundColor':
      return ColorField({ name: 'backgroundColor', label: 'Background' })
    case 'overflow':
      return OverflowField()
    case 'visibility':
      return VisibilityField()
    default: {
      const _exhaustive: never = key
      return _exhaustive
    }
  }
}

export function StyleFields(options?: {
  name?: string
  label?: false | LabelFunction | StaticLabel
  include?: StyleFieldKey[]
  /**
   * When set, padding / margin / inset / container `defaultValue` come from
   * `defineV2BlocksConfig({ [block]: … })` in `payload.config.ts`.
   */
  block?: V2BlockConfigKey
}): GroupField {
  const include = options?.include ?? STYLE_FIELD_KEYS
  return {
    type: 'group',
    name: options?.name ?? 'styles',
    label: options?.label ?? 'Styles',
    admin: {
      className: 'v2-style-fields',
    },
    fields: include.map((key) => buildField(key, options?.block)),
  }
}
