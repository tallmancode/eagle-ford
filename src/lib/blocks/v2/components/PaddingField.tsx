'use client'

import { useCallback, useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import type { BoxSide, BoxValue, BreakpointKey, SpacingUnit } from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import { boxHasRawValue } from '@/lib/blocks/v2/apply/cascade'
import { mergeBoxValue, sanitizeMeasureInput } from '@/lib/blocks/v2/apply/values'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import { BoxSidesEditor } from '@/lib/blocks/v2/components/ui/BoxSidesEditor'

export type BoxFieldClientProps = JSONFieldClientProps & {
  linkedDefault?: boolean
  unitDefault?: SpacingUnit
  allowNegative?: boolean
  allowAuto?: boolean
}

function fieldLabel(field: JSONFieldClientProps['field'], fallback: string): string {
  return typeof field?.label === 'string' ? field.label : fallback
}

function fieldDescription(field: JSONFieldClientProps['field']): string | undefined {
  if (field?.admin && typeof field.admin === 'object' && 'description' in field.admin) {
    return field.admin.description as string | undefined
  }
  return undefined
}

export function BoxStyleField({
  path,
  field,
  linkedDefault = true,
  unitDefault = 'rem',
  allowNegative = false,
  allowAuto = false,
  fallbackLabel,
}: BoxFieldClientProps & { fallbackLabel: string }) {
  const { value, setValue } = useField<BoxValue | null | undefined>({ path })
  const defaults = useMemo(
    () => ({ linked: linkedDefault, unit: unitDefault }),
    [linkedDefault, unitDefault],
  )
  const merged = useMemo(
    () => mergeBoxValue(value, defaults, { allowNegative, allowAuto }),
    [allowAuto, allowNegative, defaults, value],
  )
  const [activeBp, setActiveBp] = useState<BreakpointKey>('base')

  const overrides = useMemo(() => {
    const next = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
    for (const bp of BREAKPOINTS) next[bp] = boxHasRawValue(merged.breakpoints[bp])
    return next
  }, [merged])

  const commit = useCallback(
    (next: BoxValue) => {
      setValue(next)
    },
    [setValue],
  )

  const updateSide = useCallback(
    (side: BoxSide, raw: string) => {
      const nextVal = sanitizeMeasureInput(raw, { allowNegative, allowAuto })
      const sides = { ...merged.breakpoints[activeBp] }
      if (merged.linked) {
        sides.top = nextVal
        sides.right = nextVal
        sides.bottom = nextVal
        sides.left = nextVal
      } else {
        sides[side] = nextVal
      }
      commit({
        ...merged,
        breakpoints: { ...merged.breakpoints, [activeBp]: sides },
      })
    },
    [activeBp, allowAuto, allowNegative, commit, merged],
  )

  const toggleLinked = useCallback(() => {
    const nextLinked = !merged.linked
    if (nextLinked) {
      const current = merged.breakpoints[activeBp]
      const source = current.top || current.right || current.bottom || current.left
      commit({
        ...merged,
        linked: true,
        breakpoints: {
          ...merged.breakpoints,
          [activeBp]: { top: source, right: source, bottom: source, left: source },
        },
      })
      return
    }
    commit({ ...merged, linked: false })
  }, [activeBp, commit, merged])

  return (
    <FieldShell
      label={fieldLabel(field, fallbackLabel)}
      description={fieldDescription(field)}
      activeBp={activeBp}
      onBreakpoint={setActiveBp}
      overrides={overrides}
    >
      <BoxSidesEditor
        sides={merged.breakpoints[activeBp]}
        linked={merged.linked}
        unit={merged.unit}
        onSideChange={updateSide}
        onToggleLinked={toggleLinked}
        onUnitChange={(unit) => commit({ ...merged, unit })}
        ariaLabel={fieldLabel(field, fallbackLabel)}
      />
    </FieldShell>
  )
}

export function PaddingField(props: BoxFieldClientProps) {
  return <BoxStyleField {...props} fallbackLabel="Padding" />
}
