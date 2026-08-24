'use client'

import { useMemo, useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import type {
  BreakpointKey,
  DisplayOption,
  DisplayValue,
  FlexAlignOption,
  FlexDirectionOption,
  FlexJustifyOption,
  FlexWrapOption,
  GridColsOption,
} from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import { resolveKeywordBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import { mergeDisplayValue } from '@/lib/blocks/v2/apply/values'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import { SegmentedControl } from '@/lib/blocks/v2/components/ui/SegmentedControl'
import styles from '@/lib/blocks/v2/components/ui/field-ui.module.css'

const OPTIONS: Array<{ value: DisplayOption; label: string }> = [
  { value: 'block', label: 'Block' },
  { value: 'flex', label: 'Flex' },
  { value: 'inline-flex', label: 'Inline flex' },
  { value: 'grid', label: 'Grid' },
  { value: 'inline-block', label: 'Inline block' },
  { value: 'none', label: 'None' },
]

const FLEX_DIRECTION_OPTIONS: Array<{ value: FlexDirectionOption; label: string }> = [
  { value: 'row', label: 'Row' },
  { value: 'row-reverse', label: 'Row reverse' },
  { value: 'col', label: 'Column' },
  { value: 'col-reverse', label: 'Column reverse' },
]

const FLEX_WRAP_OPTIONS: Array<{ value: FlexWrapOption; label: string }> = [
  { value: 'nowrap', label: 'No wrap' },
  { value: 'wrap', label: 'Wrap' },
  { value: 'wrap-reverse', label: 'Wrap reverse' },
]

const FLEX_JUSTIFY_OPTIONS: Array<{ value: FlexJustifyOption; label: string }> = [
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'between', label: 'Between' },
  { value: 'around', label: 'Around' },
  { value: 'evenly', label: 'Evenly' },
]

const FLEX_ALIGN_OPTIONS: Array<{ value: FlexAlignOption; label: string }> = [
  { value: 'start', label: 'Start' },
  { value: 'end', label: 'End' },
  { value: 'center', label: 'Center' },
  { value: 'baseline', label: 'Baseline' },
  { value: 'stretch', label: 'Stretch' },
]

const GRID_COLS_OPTIONS: Array<{ value: GridColsOption; label: string }> = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
]

function isFlexDisplay(display: DisplayOption | ''): boolean {
  return display === 'flex' || display === 'inline-flex'
}

function isGridDisplay(display: DisplayOption | ''): boolean {
  return display === 'grid'
}

export function DisplayField({ path, field }: JSONFieldClientProps) {
  const { value, setValue } = useField<DisplayValue | null | undefined>({ path })
  const merged = useMemo(() => mergeDisplayValue(value), [value])
  const [activeBp, setActiveBp] = useState<BreakpointKey>('base')
  /** Optimistic mode so flex/grid extras appear immediately on click. */
  const [draftDisplay, setDraftDisplay] = useState<DisplayOption | '' | null>(null)

  const overrides = useMemo(() => {
    const next = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
    for (const bp of BREAKPOINTS) {
      next[bp] =
        merged.breakpoints[bp] !== '' ||
        merged.flexDirection[bp] !== '' ||
        merged.flexWrap[bp] !== '' ||
        merged.flexJustify[bp] !== '' ||
        merged.flexAlign[bp] !== '' ||
        merged.gridCols[bp] !== ''
    }
    return next
  }, [merged])

  const resolvedDisplay = useMemo(
    () => resolveKeywordBreakpoints(merged.breakpoints),
    [merged.breakpoints],
  )

  const storedAtBp = merged.breakpoints[activeBp]
  const activeDisplay =
    draftDisplay !== null ? draftDisplay : storedAtBp !== '' ? storedAtBp : resolvedDisplay[activeBp]
  const showFlexExtras = isFlexDisplay(activeDisplay)
  const showGridExtras = isGridDisplay(activeDisplay)

  const label = typeof field?.label === 'string' ? field.label : 'Display'
  const description =
    field?.admin && typeof field.admin === 'object' && 'description' in field.admin
      ? (field.admin.description as string | undefined)
      : undefined

  function patch(
    next: Partial<{
      breakpoints: typeof merged.breakpoints
      flexDirection: typeof merged.flexDirection
      flexWrap: typeof merged.flexWrap
      flexJustify: typeof merged.flexJustify
      flexAlign: typeof merged.flexAlign
      gridCols: typeof merged.gridCols
    }>,
  ) {
    setValue({
      breakpoints: merged.breakpoints,
      flexDirection: merged.flexDirection,
      flexWrap: merged.flexWrap,
      flexJustify: merged.flexJustify,
      flexAlign: merged.flexAlign,
      gridCols: merged.gridCols,
      ...next,
    })
  }

  function onDisplayChange(next: DisplayOption | '') {
    setDraftDisplay(next)
    patch({
      breakpoints: { ...merged.breakpoints, [activeBp]: next },
    })
  }

  function onBreakpointChange(next: BreakpointKey) {
    setDraftDisplay(null)
    setActiveBp(next)
  }

  return (
    <FieldShell
      label={label}
      description={description}
      activeBp={activeBp}
      onBreakpoint={onBreakpointChange}
      overrides={overrides}
      defaultOpen
    >
      <SegmentedControl
        value={draftDisplay !== null ? draftDisplay : merged.breakpoints[activeBp]}
        options={OPTIONS}
        ariaLabel={label}
        onChange={onDisplayChange}
      />
      {showFlexExtras ? (
        <div className={styles.subGroup}>
          <p className={styles.subGroupLabel}>Flex</p>
          <p className={styles.hint}>Direction</p>
          <SegmentedControl
            value={merged.flexDirection[activeBp]}
            options={FLEX_DIRECTION_OPTIONS}
            ariaLabel="Flex direction"
            onChange={(next) =>
              patch({
                flexDirection: { ...merged.flexDirection, [activeBp]: next },
              })
            }
          />
          <p className={styles.hint}>Wrap</p>
          <SegmentedControl
            value={merged.flexWrap[activeBp]}
            options={FLEX_WRAP_OPTIONS}
            ariaLabel="Flex wrap"
            onChange={(next) =>
              patch({
                flexWrap: { ...merged.flexWrap, [activeBp]: next },
              })
            }
          />
          <p className={styles.hint}>Justify</p>
          <SegmentedControl
            value={merged.flexJustify[activeBp]}
            options={FLEX_JUSTIFY_OPTIONS}
            ariaLabel="Flex justify"
            onChange={(next) =>
              patch({
                flexJustify: { ...merged.flexJustify, [activeBp]: next },
              })
            }
          />
          <p className={styles.hint}>Align</p>
          <SegmentedControl
            value={merged.flexAlign[activeBp]}
            options={FLEX_ALIGN_OPTIONS}
            ariaLabel="Flex align"
            onChange={(next) =>
              patch({
                flexAlign: { ...merged.flexAlign, [activeBp]: next },
              })
            }
          />
        </div>
      ) : null}
      {showGridExtras ? (
        <div className={styles.subGroup}>
          <p className={styles.subGroupLabel}>Grid</p>
          <p className={styles.hint}>Columns</p>
          <SegmentedControl
            value={merged.gridCols[activeBp]}
            options={GRID_COLS_OPTIONS}
            ariaLabel="Grid columns"
            onChange={(next) =>
              patch({
                gridCols: { ...merged.gridCols, [activeBp]: next },
              })
            }
          />
        </div>
      ) : null}
      {!showFlexExtras && !showGridExtras ? (
        <p className={styles.inheritHint}>
          Choose Flex, Inline flex, or Grid to set direction, wrap, justify, align, or columns.
        </p>
      ) : null}
    </FieldShell>
  )
}
