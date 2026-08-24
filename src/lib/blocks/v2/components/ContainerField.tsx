'use client'

import { useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import type { BreakpointKey, ContainerValue } from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import { mergeContainerValue } from '@/lib/blocks/v2/apply/values'
import { resolveContainerBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import { ToggleControl } from '@/lib/blocks/v2/components/ui/SegmentedControl'

type Props = JSONFieldClientProps & { defaultEnabled?: boolean }

export function ContainerField({ path, field, defaultEnabled = true }: Props) {
  const { value, setValue } = useField<ContainerValue | null | undefined>({ path })
  const merged = useMemo(() => mergeContainerValue(value, defaultEnabled), [defaultEnabled, value])
  const [activeBp, setActiveBp] = useState<BreakpointKey>('base')
  const resolved = resolveContainerBreakpoints(merged.breakpoints)
  const overrides = useMemo(() => {
    const next = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
    for (const bp of BREAKPOINTS) next[bp] = merged.breakpoints[bp] !== null
    return next
  }, [merged])

  const label = typeof field?.label === 'string' ? field.label : 'Container'
  const description =
    field?.admin && typeof field.admin === 'object' && 'description' in field.admin
      ? (field.admin.description as string | undefined)
      : undefined

  return (
    <FieldShell
      label={label}
      description={description}
      activeBp={activeBp}
      onBreakpoint={setActiveBp}
      overrides={overrides}
    >
      <ToggleControl
        checked={resolved[activeBp]}
        label="Constrain to container"
        onChange={(checked) =>
          setValue({
            breakpoints: {
              ...merged.breakpoints,
              [activeBp]: checked,
            },
          })
        }
      />
    </FieldShell>
  )
}
