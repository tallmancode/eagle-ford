'use client'

import { useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import type { BreakpointKey, OverflowOption, OverflowValue } from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import { overflowHasRawValue } from '@/lib/blocks/v2/apply/cascade'
import { mergeOverflowValue } from '@/lib/blocks/v2/apply/values'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import { SegmentedControl } from '@/lib/blocks/v2/components/ui/SegmentedControl'
import { Link2, Link2Off } from 'lucide-react'
import styles from './ui/field-ui.module.css'

const OPTIONS: Array<{ value: OverflowOption; label: string }> = [
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'scroll', label: 'Scroll' },
  { value: 'auto', label: 'Auto' },
  { value: 'clip', label: 'Clip' },
]

type Props = JSONFieldClientProps & { linkedDefault?: boolean }

export function OverflowField({ path, field, linkedDefault = true }: Props) {
  const { value, setValue } = useField<OverflowValue | null | undefined>({ path })
  const merged = useMemo(() => mergeOverflowValue(value, linkedDefault), [linkedDefault, value])
  const [activeBp, setActiveBp] = useState<BreakpointKey>('base')
  const axes = merged.breakpoints[activeBp]
  const overrides = useMemo(() => {
    const next = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
    for (const bp of BREAKPOINTS) next[bp] = overflowHasRawValue(merged.breakpoints[bp])
    return next
  }, [merged])

  const label = typeof field?.label === 'string' ? field.label : 'Overflow'
  const description =
    field?.admin && typeof field.admin === 'object' && 'description' in field.admin
      ? (field.admin.description as string | undefined)
      : undefined

  function patchAxes(next: { x: OverflowOption | ''; y: OverflowOption | '' }) {
    setValue({
      ...merged,
      breakpoints: { ...merged.breakpoints, [activeBp]: next },
    })
  }

  return (
    <FieldShell
      label={label}
      description={description}
      activeBp={activeBp}
      onBreakpoint={setActiveBp}
      overrides={overrides}
    >
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.linkBtn} ${merged.linked ? styles.linkBtnActive : ''}`}
          onClick={() => {
            const nextLinked = !merged.linked
            const source = axes.x || axes.y
            setValue({
              ...merged,
              linked: nextLinked,
              breakpoints: nextLinked
                ? { ...merged.breakpoints, [activeBp]: { x: source, y: source } }
                : merged.breakpoints,
            })
          }}
          aria-pressed={merged.linked}
          title={merged.linked ? 'Unlink axes' : 'Link axes'}
        >
          {merged.linked ? <Link2 size={16} /> : <Link2Off size={16} />}
          <span className={styles.srOnly}>{merged.linked ? 'Unlink axes' : 'Link axes'}</span>
        </button>
      </div>
      {merged.linked ? (
        <SegmentedControl
          value={axes.x}
          options={OPTIONS}
          ariaLabel={`${label} both`}
          onChange={(next) => patchAxes({ x: next, y: next })}
        />
      ) : (
        <>
          <p className={styles.hint}>Horizontal</p>
          <SegmentedControl
            value={axes.x}
            options={OPTIONS}
            ariaLabel={`${label} horizontal`}
            onChange={(next) => patchAxes({ ...axes, x: next })}
          />
          <p className={styles.hint}>Vertical</p>
          <SegmentedControl
            value={axes.y}
            options={OPTIONS}
            ariaLabel={`${label} vertical`}
            onChange={(next) => patchAxes({ ...axes, y: next })}
          />
        </>
      )}
    </FieldShell>
  )
}
