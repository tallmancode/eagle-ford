'use client'

import { useCallback, useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import {
  ChevronDown,
  ChevronRight,
  Link2,
  Link2Off,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react'
import type { JSONFieldClientProps } from 'payload'
import type {
  LayoutSpacingValue,
  SpacingAxis,
  SpacingBreakpointKey,
  SpacingSides,
  SpacingUnit,
} from '@/lib/fields/layout-field/utils/layout-utils'
import {
  DEFAULT_SPACING_UNIT,
  emptySpacingAxis,
  mergeLayoutSpacingWithDefaults,
  SPACING_BREAKPOINTS,
  SPACING_UNITS,
} from '@/lib/fields/layout-field/utils/layout-utils'
import styles from './SpacingLayoutField.module.css'

type ExcludeAxis = 'padding' | 'margin'

type ClientProps = {
  exclude?: ExcludeAxis[]
}

const SIDE_KEYS: (keyof SpacingSides)[] = ['top', 'right', 'bottom', 'left']

const BP_META: Record<SpacingBreakpointKey, { label: string; Icon: typeof Smartphone }> = {
  base: { label: 'Mobile (<768px)', Icon: Smartphone },
  md: { label: 'Tablet (≥768px)', Icon: Tablet },
  lg: { label: 'Desktop (≥1024px)', Icon: Monitor },
}

function cycleBreakpoint(current: SpacingBreakpointKey): SpacingBreakpointKey {
  const i = SPACING_BREAKPOINTS.indexOf(current)
  return SPACING_BREAKPOINTS[(i + 1) % SPACING_BREAKPOINTS.length]
}

const hintClass: Record<keyof SpacingSides, string> = {
  top: styles.hintTop,
  right: styles.hintRight,
  bottom: styles.hintBottom,
  left: styles.hintLeft,
}

export function SpacingLayoutField(props: JSONFieldClientProps) {
  const { path, field } = props
  const clientProps = (props as JSONFieldClientProps & { customProps?: ClientProps }).customProps
  const exclude = useMemo(() => clientProps?.exclude ?? [], [clientProps?.exclude])
  const excluded = useMemo(() => new Set(exclude), [exclude])

  const { value, setValue } = useField<LayoutSpacingValue | null | undefined>({ path })

  const merged = useMemo(() => mergeLayoutSpacingWithDefaults(value, exclude), [value, exclude])

  const [open, setOpen] = useState(true)
  const [activeBp, setActiveBp] = useState<SpacingBreakpointKey>('base')

  const commit = useCallback(
    (next: LayoutSpacingValue) => {
      const cleaned: LayoutSpacingValue = {}
      if (!excluded.has('padding')) {
        cleaned.padding = next.padding ?? emptySpacingAxis()
      }
      if (!excluded.has('margin')) {
        cleaned.margin = next.margin ?? emptySpacingAxis()
      }
      setValue(cleaned)
    },
    [excluded, setValue],
  )

  const patchAxis = useCallback(
    (axisKey: ExcludeAxis, updater: (prev: SpacingAxis) => SpacingAxis) => {
      const base = mergeLayoutSpacingWithDefaults(value, exclude)
      const prevAxis = base[axisKey] ?? emptySpacingAxis()
      const nextAxis = updater(prevAxis)
      commit({ ...base, [axisKey]: nextAxis })
    },
    [commit, exclude, value],
  )

  const updateSide = useCallback(
    (axisKey: ExcludeAxis, side: keyof SpacingSides, raw: string) => {
      const normalized = raw.replace(/[^\d.]/g, '')
      patchAxis(axisKey, (axis) => {
        const sides = { ...axis.breakpoints[activeBp] }
        const nextVal = normalized
        if (axis.linked) {
          for (const k of SIDE_KEYS) {
            sides[k] = nextVal
          }
        } else {
          sides[side] = nextVal
        }
        return {
          ...axis,
          breakpoints: {
            ...axis.breakpoints,
            [activeBp]: sides,
          },
        }
      })
    },
    [activeBp, patchAxis],
  )

  const updateUnit = useCallback(
    (axisKey: ExcludeAxis, unit: SpacingUnit) => {
      patchAxis(axisKey, (axis) => ({ ...axis, unit }))
    },
    [patchAxis],
  )

  const toggleLinked = useCallback(
    (axisKey: ExcludeAxis) => {
      patchAxis(axisKey, (axis) => ({ ...axis, linked: !axis.linked }))
    },
    [patchAxis],
  )

  const showPadding = !excluded.has('padding')
  const showMargin = !excluded.has('margin')

  const description =
    field?.admin && typeof field.admin === 'object' && 'description' in field.admin
      ? (field.admin.description as string | undefined)
      : undefined

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)}>
          <span className={styles.triggerIcon} aria-hidden>
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span>{typeof field.label === 'string' ? field.label : 'Spacing'}</span>
        </button>

        {open ? (
          <div className={styles.body}>
            {description ? (
              <p style={{ margin: 0, fontSize: 12, color: 'var(--theme-elevation-600, #666)' }}>
                {description}
              </p>
            ) : null}

            {showMargin ? (
              <SpacingAxisRow
                axisKey="margin"
                label="Margins"
                merged={merged}
                activeBp={activeBp}
                onCycleBp={() => setActiveBp((prev) => cycleBreakpoint(prev))}
                onToggleLinked={() => toggleLinked('margin')}
                onSideChange={(side, v) => updateSide('margin', side, v)}
                onUnitChange={(u) => updateUnit('margin', u)}
              />
            ) : null}

            {showPadding ? (
              <SpacingAxisRow
                axisKey="padding"
                label="Padding"
                merged={merged}
                activeBp={activeBp}
                onCycleBp={() => setActiveBp((prev) => cycleBreakpoint(prev))}
                onToggleLinked={() => toggleLinked('padding')}
                onSideChange={(side, v) => updateSide('padding', side, v)}
                onUnitChange={(u) => updateUnit('padding', u)}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function SpacingAxisRow({
  axisKey,
  label,
  merged,
  activeBp,
  onCycleBp,
  onToggleLinked,
  onSideChange,
  onUnitChange,
}: {
  axisKey: ExcludeAxis
  label: string
  merged: LayoutSpacingValue
  activeBp: SpacingBreakpointKey
  onCycleBp: () => void
  onToggleLinked: () => void
  onSideChange: (side: keyof SpacingSides, value: string) => void
  onUnitChange: (unit: SpacingUnit) => void
}) {
  const axis = merged[axisKey] ?? emptySpacingAxis()
  const sides = axis.breakpoints[activeBp]
  const { Icon, label: bpLabel } = BP_META[activeBp]

  const placeholders: Record<ExcludeAxis, string> = {
    margin: '0',
    padding: '20',
  }

  return (
    <div className={styles.rowMain}>
      <span className={styles.rowLabel}>{label}</span>

      <div className={styles.rowActions}>
        <button
          type="button"
          className={`${styles.iconBtn} ${axis.linked ? styles.iconBtnActive : ''}`}
          onClick={onToggleLinked}
          title={
            axis.linked ? 'Unlink sides (edit top/right/bottom/left separately)' : 'Link sides'
          }
          aria-pressed={axis.linked}
        >
          {axis.linked ? <Link2 size={16} /> : <Link2Off size={16} />}
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onCycleBp}
          title={`Breakpoint: ${bpLabel}. Click to switch.`}
          aria-label={`Breakpoint: ${bpLabel}. Click to switch.`}
        >
          <Icon size={16} />
        </button>
      </div>

      <div className={styles.clusterWrap}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
          <div className={styles.cluster} style={{ flex: 1 }}>
            {SIDE_KEYS.map((side) => (
              <div key={side} className={styles.cell}>
                <input
                  className={styles.input}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={placeholders[axisKey]}
                  value={sides[side]}
                  onChange={(e) => onSideChange(side, e.target.value)}
                  aria-label={`${label} ${side} (${bpLabel})`}
                />
              </div>
            ))}
          </div>
          <select
            className={styles.unitSelect}
            value={axis.unit ?? DEFAULT_SPACING_UNIT}
            onChange={(e) => onUnitChange(e.target.value as SpacingUnit)}
            aria-label={`${label} unit`}
          >
            {SPACING_UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.sideHints}>
          {SIDE_KEYS.map((side) => (
            <div key={side} className={styles.sideHint}>
              <span className={`${styles.hintBox} ${hintClass[side]}`} title={side} aria-hidden />
            </div>
          ))}
        </div>
        <div className={styles.bpLabel}>{bpLabel}</div>
      </div>
    </div>
  )
}
