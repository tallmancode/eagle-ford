'use client'

import { useCallback, useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import type { BreakpointKey, GapValue, SpacingUnit } from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import { axisHasRawValue } from '@/lib/blocks/v2/apply/cascade'
import { mergeGapValue, sanitizeMeasureInput } from '@/lib/blocks/v2/apply/values'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import { TwoAxisEditor } from '@/lib/blocks/v2/components/ui/TwoAxisEditor'

type Props = JSONFieldClientProps & {
  linkedDefault?: boolean
  unitDefault?: SpacingUnit
}

export function GapField({ path, field, linkedDefault = true, unitDefault = 'rem' }: Props) {
  const { value, setValue } = useField<GapValue | null | undefined>({ path })
  const defaults = useMemo(
    () => ({ linked: linkedDefault, unit: unitDefault }),
    [linkedDefault, unitDefault],
  )
  const merged = useMemo(() => mergeGapValue(value, defaults), [defaults, value])
  const [activeBp, setActiveBp] = useState<BreakpointKey>('base')

  const overrides = useMemo(() => {
    const next = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
    for (const bp of BREAKPOINTS) next[bp] = axisHasRawValue(merged.breakpoints[bp])
    return next
  }, [merged])

  const pair = merged.breakpoints[activeBp]
  const label = typeof field?.label === 'string' ? field.label : 'Gap'
  const description =
    field?.admin && typeof field.admin === 'object' && 'description' in field.admin
      ? (field.admin.description as string | undefined)
      : undefined

  const updateAxis = useCallback(
    (axis: 'row' | 'column', raw: string) => {
      const nextVal = sanitizeMeasureInput(raw, { allowNegative: false, allowAuto: false })
      const nextPair = merged.linked
        ? { row: nextVal, column: nextVal }
        : { ...pair, [axis]: nextVal }
      setValue({
        ...merged,
        breakpoints: { ...merged.breakpoints, [activeBp]: nextPair },
      })
    },
    [activeBp, merged, pair, setValue],
  )

  return (
    <FieldShell
      label={label}
      description={description}
      activeBp={activeBp}
      onBreakpoint={setActiveBp}
      overrides={overrides}
    >
      <TwoAxisEditor
        linked={merged.linked}
        unit={merged.unit}
        first={pair.row}
        second={pair.column}
        firstLabel="Row"
        secondLabel="Column"
        ariaLabel={label}
        onToggleLinked={() => {
          const nextLinked = !merged.linked
          const source = pair.row || pair.column
          setValue({
            ...merged,
            linked: nextLinked,
            breakpoints: nextLinked
              ? { ...merged.breakpoints, [activeBp]: { row: source, column: source } }
              : merged.breakpoints,
          })
        }}
        onUnitChange={(unit) => setValue({ ...merged, unit })}
        onFirstChange={(next) => updateAxis('row', next)}
        onSecondChange={(next) => updateAxis('column', next)}
      />
    </FieldShell>
  )
}
