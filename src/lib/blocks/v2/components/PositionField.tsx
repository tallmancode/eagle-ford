'use client'

import { useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import type { BreakpointKey, PositionOption, PositionValue } from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import { mergePositionValue } from '@/lib/blocks/v2/apply/values'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import { SegmentedControl } from '@/lib/blocks/v2/components/ui/SegmentedControl'

const OPTIONS: Array<{ value: PositionOption; label: string }> = [
  { value: 'static', label: 'Static' },
  { value: 'relative', label: 'Relative' },
  { value: 'absolute', label: 'Absolute' },
  { value: 'sticky', label: 'Sticky' },
  { value: 'fixed', label: 'Fixed' },
]

export function PositionField({ path, field }: JSONFieldClientProps) {
  const { value, setValue } = useField<PositionValue | null | undefined>({ path })
  const merged = useMemo(() => mergePositionValue(value), [value])
  const [activeBp, setActiveBp] = useState<BreakpointKey>('base')
  const overrides = useMemo(() => {
    const next = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
    for (const bp of BREAKPOINTS) next[bp] = merged.breakpoints[bp] !== ''
    return next
  }, [merged])

  const label = typeof field?.label === 'string' ? field.label : 'Position'
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
      <SegmentedControl
        value={merged.breakpoints[activeBp]}
        options={OPTIONS}
        ariaLabel={label}
        onChange={(next) =>
          setValue({
            breakpoints: { ...merged.breakpoints, [activeBp]: next },
          })
        }
      />
    </FieldShell>
  )
}
