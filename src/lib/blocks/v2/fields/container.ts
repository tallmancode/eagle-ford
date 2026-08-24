import type { JSONField } from 'payload'
import { v2Theme } from '@/lib/blocks/v2/theme'
import { emptyContainerValue, validateContainerValue } from '@/lib/blocks/v2/apply/values'
import { styleJsonField, type StyleFieldLabels } from '@/lib/blocks/v2/fields/json-field'
import type { ContainerValue } from '@/lib/blocks/v2/types'

export function ContainerField(
  options?: StyleFieldLabels & {
    defaults?: { enabled?: boolean }
    defaultValue?: ContainerValue | (() => ContainerValue)
  },
): JSONField {
  const enabled = options?.defaults?.enabled ?? v2Theme.container.defaultEnabled
  const defaultValue = options?.defaultValue ?? emptyContainerValue(enabled)
  return styleJsonField({
    name: options?.name ?? 'container',
    label: options?.label ?? 'Container',
    description:
      options?.description ?? 'Constrain width to the site container. Can differ per breakpoint.',
    componentPath: '@/lib/blocks/v2/components/ContainerField#ContainerField',
    defaultValue,
    validate: validateContainerValue,
    clientProps: {
      defaultEnabled:
        typeof options?.defaults?.enabled === 'boolean'
          ? options.defaults.enabled
          : enabled,
    },
  })
}
