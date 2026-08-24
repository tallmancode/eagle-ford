'use client'

import { useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import type { BreakpointKey, VisibilityOption, VisibilityValue } from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import { mergeVisibilityValue } from '@/lib/blocks/v2/apply/values'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import { SegmentedControl } from '@/lib/blocks/v2/components/ui/SegmentedControl'

const OPTIONS: Array<{ value: VisibilityOption; label: string }> = [
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'invisible', label: 'Invisible' },
]

export function VisibilityField({ path, field }: JSONFieldClientProps) {
  const { value, setValue } = useField<VisibilityValue | null | undefined>({ path })
  const merged = useMemo(() => mergeVisibilityValue(value), [value])
  const [activeBp, setActiveBp] = useState<BreakpointKey>('base')
  const overrides = useMemo(() => {
    const next = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
    for (const bp of BREAKPOINTS) next[bp] = merged.breakpoints[bp] !== ''
    return next
  }, [merged])

  const label = typeof field?.label === 'string' ? field.label : 'Visibility'
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
