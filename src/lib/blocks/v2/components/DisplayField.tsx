'use client'

import { useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import type { BreakpointKey, DisplayOption, DisplayValue } from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import { mergeDisplayValue } from '@/lib/blocks/v2/apply/values'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import { SegmentedControl } from '@/lib/blocks/v2/components/ui/SegmentedControl'

const OPTIONS: Array<{ value: DisplayOption; label: string }> = [
  { value: 'block', label: 'Block' },
  { value: 'flex', label: 'Flex' },
  { value: 'inline-flex', label: 'Inline flex' },
  { value: 'grid', label: 'Grid' },
  { value: 'inline-block', label: 'Inline block' },
  { value: 'none', label: 'None' },
]

export function DisplayField({ path, field }: JSONFieldClientProps) {
  const { value, setValue } = useField<DisplayValue | null | undefined>({ path })
  const merged = useMemo(() => mergeDisplayValue(value), [value])
  const [activeBp, setActiveBp] = useState<BreakpointKey>('base')
  const overrides = useMemo(() => {
    const next = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
    for (const bp of BREAKPOINTS) next[bp] = merged.breakpoints[bp] !== ''
    return next
  }, [merged])

  const label = typeof field?.label === 'string' ? field.label : 'Display'
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
