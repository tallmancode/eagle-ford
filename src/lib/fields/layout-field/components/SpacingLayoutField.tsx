'use client'

import { useCallback, useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import {
  ArrowDown,
  ArrowRight,
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
  FlexAlign,
  FlexBreakpointSettings,
  FlexDirection,
  FlexJustify,
  FlexLayoutValue,
  LayoutSpacingValue,
  SpacingAxis,
  SpacingBreakpointKey,
  SpacingSides,
  SpacingUnit,
} from '@/lib/fields/layout-field/utils/layout-utils'
import {
  DEFAULT_SPACING_UNIT,
  emptySpacingAxis,
  mergeFlexLayoutWithDefaults,
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

const JUSTIFY_LABELS: Record<FlexJustify, string> = {
  start: 'Start',
  center: 'Center',
  end: 'End',
  between: 'Space between',
  around: 'Space around',
  evenly: 'Space evenly',
}

const ALIGN_LABELS: Record<FlexAlign, string> = {
  start: 'Start',
  center: 'Center',
  end: 'End',
  stretch: 'Stretch',
  baseline: 'Baseline',
}

function cycleBreakpoint(current: SpacingBreakpointKey): SpacingBreakpointKey {
  const i = SPACING_BREAKPOINTS.indexOf(current)
  return SPACING_BREAKPOINTS[(i + 1) % SPACING_BREAKPOINTS.length]
}

function flexPathFromSpacingPath(spacingPath: string): string {
  return spacingPath.replace(/\.spacing$/, '.flex')
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
  const flexPath = useMemo(() => flexPathFromSpacingPath(path), [path])
  const { value: flexValue, setValue: setFlexValue } = useField<FlexLayoutValue | null | undefined>(
    { path: flexPath },
  )

  const merged = useMemo(() => mergeLayoutSpacingWithDefaults(value, exclude), [value, exclude])
  const mergedFlex = useMemo(() => mergeFlexLayoutWithDefaults(flexValue), [flexValue])

  const [open, setOpen] = useState(true)
  const [flexOpen, setFlexOpen] = useState(true)
  const [spacingOpen, setSpacingOpen] = useState(true)
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

  const commitFlex = useCallback(
    (next: FlexLayoutValue) => {
      setFlexValue(next)
    },
    [setFlexValue],
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

  const patchFlexBreakpoint = useCallback(
    (updater: (prev: FlexBreakpointSettings) => FlexBreakpointSettings) => {
      const base = mergeFlexLayoutWithDefaults(flexValue)
      const prev = base.breakpoints[activeBp]
      const next = updater(prev)
      commitFlex({
        ...base,
        breakpoints: {
          ...base.breakpoints,
          [activeBp]: next,
        },
      })
    },
    [activeBp, commitFlex, flexValue],
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

  const updateFlexDirection = useCallback(
    (direction: FlexDirection | '') => {
      patchFlexBreakpoint((prev) => ({ ...prev, direction }))
    },
    [patchFlexBreakpoint],
  )

  const updateFlexJustify = useCallback(
    (justifyContent: FlexJustify | '') => {
      patchFlexBreakpoint((prev) => ({ ...prev, justifyContent }))
    },
    [patchFlexBreakpoint],
  )

  const updateFlexAlign = useCallback(
    (alignItems: FlexAlign | '') => {
      patchFlexBreakpoint((prev) => ({ ...prev, alignItems }))
    },
    [patchFlexBreakpoint],
  )

  const updateFlexGap = useCallback(
    (raw: string) => {
      const normalized = raw.replace(/[^\d.]/g, '')
      patchFlexBreakpoint((prev) => ({ ...prev, gap: normalized }))
    },
    [patchFlexBreakpoint],
  )

  const updateFlexGapUnit = useCallback(
    (unit: SpacingUnit) => {
      const base = mergeFlexLayoutWithDefaults(flexValue)
      commitFlex({ ...base, gapUnit: unit })
    },
    [commitFlex, flexValue],
  )

  const clearFlexBreakpoint = useCallback(() => {
    patchFlexBreakpoint(() => ({
      direction: '',
      justifyContent: '',
      alignItems: '',
      gap: '',
    }))
  }, [patchFlexBreakpoint])

  const showPadding = !excluded.has('padding')
  const showMargin = !excluded.has('margin')
  const showSpacing = showPadding || showMargin

  const description =
    field?.admin && typeof field.admin === 'object' && 'description' in field.admin
      ? (field.admin.description as string | undefined)
      : undefined

  const flexBp = mergedFlex.breakpoints[activeBp]
  const { Icon: BpIcon, label: bpLabel } = BP_META[activeBp]

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <button type="button" className={styles.trigger} onClick={() => setOpen((o) => !o)}>
          <span className={styles.triggerIcon} aria-hidden>
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span>Layout</span>
        </button>

        {open ? (
          <div className={styles.body}>
            <div className={styles.subPanel}>
              <button
                type="button"
                className={styles.subTrigger}
                onClick={() => setFlexOpen((o) => !o)}
              >
                <span className={styles.triggerIcon} aria-hidden>
                  {flexOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <span>Flex</span>
              </button>

              {flexOpen ? (
                <div className={styles.subBody}>
                  <p className={styles.hint}>
                    Set direction to enable flex layout on single-column sections.
                  </p>

                  <div className={styles.flexRow}>
                    <span className={styles.rowLabel}>Breakpoint</span>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setActiveBp((prev) => cycleBreakpoint(prev))}
                        title={`Breakpoint: ${bpLabel}. Click to switch.`}
                        aria-label={`Breakpoint: ${bpLabel}. Click to switch.`}
                      >
                        <BpIcon size={16} />
                      </button>
                      <button
                        type="button"
                        className={styles.textBtn}
                        onClick={clearFlexBreakpoint}
                        title="Clear flex settings for this breakpoint"
                      >
                        Clear
                      </button>
                    </div>
                    <span className={styles.bpLabelInline}>{bpLabel}</span>
                  </div>

                  <div className={styles.flexRow}>
                    <span className={styles.rowLabel}>Direction</span>
                    <div className={styles.toggleGroup}>
                      <button
                        type="button"
                        className={`${styles.toggleBtn} ${flexBp.direction === 'row' ? styles.toggleBtnActive : ''}`}
                        onClick={() => updateFlexDirection(flexBp.direction === 'row' ? '' : 'row')}
                        aria-pressed={flexBp.direction === 'row'}
                      >
                        <ArrowRight size={14} aria-hidden />
                        Row
                      </button>
                      <button
                        type="button"
                        className={`${styles.toggleBtn} ${flexBp.direction === 'column' ? styles.toggleBtnActive : ''}`}
                        onClick={() =>
                          updateFlexDirection(flexBp.direction === 'column' ? '' : 'column')
                        }
                        aria-pressed={flexBp.direction === 'column'}
                      >
                        <ArrowDown size={14} aria-hidden />
                        Column
                      </button>
                    </div>
                  </div>

                  <div className={styles.flexRow}>
                    <span className={styles.rowLabel}>Justify</span>
                    <select
                      className={styles.flexSelect}
                      value={flexBp.justifyContent}
                      onChange={(e) => updateFlexJustify(e.target.value as FlexJustify | '')}
                      aria-label={`Justify content (${bpLabel})`}
                    >
                      <option value="">Default</option>
                      {(Object.keys(JUSTIFY_LABELS) as FlexJustify[]).map((key) => (
                        <option key={key} value={key}>
                          {JUSTIFY_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.flexRow}>
                    <span className={styles.rowLabel}>Align</span>
                    <select
                      className={styles.flexSelect}
                      value={flexBp.alignItems}
                      onChange={(e) => updateFlexAlign(e.target.value as FlexAlign | '')}
                      aria-label={`Align items (${bpLabel})`}
                    >
                      <option value="">Default</option>
                      {(Object.keys(ALIGN_LABELS) as FlexAlign[]).map((key) => (
                        <option key={key} value={key}>
                          {ALIGN_LABELS[key]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.flexRow}>
                    <span className={styles.rowLabel}>Gap</span>
                    <div className={styles.gapInputWrap}>
                      <input
                        className={styles.gapInput}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="0"
                        value={flexBp.gap}
                        onChange={(e) => updateFlexGap(e.target.value)}
                        aria-label={`Gap (${bpLabel})`}
                      />
                      <select
                        className={styles.unitSelect}
                        value={mergedFlex.gapUnit ?? DEFAULT_SPACING_UNIT}
                        onChange={(e) => updateFlexGapUnit(e.target.value as SpacingUnit)}
                        aria-label="Gap unit"
                      >
                        {SPACING_UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {showSpacing ? (
              <div className={styles.subPanel}>
                <button
                  type="button"
                  className={styles.subTrigger}
                  onClick={() => setSpacingOpen((o) => !o)}
                >
                  <span className={styles.triggerIcon} aria-hidden>
                    {spacingOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  <span>{typeof field.label === 'string' ? field.label : 'Spacing'}</span>
                </button>

                {spacingOpen ? (
                  <div className={styles.subBody}>
                    {description ? <p className={styles.hint}>{description}</p> : null}

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
