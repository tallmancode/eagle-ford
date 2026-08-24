import type {
  DisplayOption,
  DisplayValue,
  FlexAlignOption,
  FlexDirectionOption,
  FlexJustifyOption,
  FlexWrapOption,
  GridColsOption,
  PositionOption,
  PositionValue,
} from '@/lib/blocks/v2/types'
import {
  classesForKeywordChanges,
  emptyKeywordBreakpoints,
  resolveKeywordBreakpoints,
} from '@/lib/blocks/v2/apply/cascade'
import { emptyApplyResult } from '@/lib/blocks/v2/apply/result'
import {
  keywordHasValues,
  mergeDisplayValue,
  mergePositionValue,
} from '@/lib/blocks/v2/apply/values'
import type { ApplyResult, BreakpointKey, KeywordBreakpoints } from '@/lib/blocks/v2/types'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'

const DISPLAY_CLASS: Record<DisplayOption, string> = {
  block: 'block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-block': 'inline-block',
  none: 'hidden',
}

const FLEX_DIRECTION_CLASS: Record<FlexDirectionOption, string> = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
}

const FLEX_WRAP_CLASS: Record<FlexWrapOption, string> = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
}

const FLEX_JUSTIFY_CLASS: Record<FlexJustifyOption, string> = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const FLEX_ALIGN_CLASS: Record<FlexAlignOption, string> = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
}

const GRID_COLS_CLASS: Record<GridColsOption, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
  '6': 'grid-cols-6',
  '7': 'grid-cols-7',
  '8': 'grid-cols-8',
  '9': 'grid-cols-9',
  '10': 'grid-cols-10',
  '11': 'grid-cols-11',
  '12': 'grid-cols-12',
}

const POSITION_CLASS: Record<PositionOption, string> = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  sticky: 'sticky',
  fixed: 'fixed',
}

function isFlexDisplay(display: DisplayOption | ''): boolean {
  return display === 'flex' || display === 'inline-flex'
}

function isGridDisplay(display: DisplayOption | ''): boolean {
  return display === 'grid'
}

/** Clear extras at breakpoints where the display mode does not use them. */
function gateByDisplay<T extends string>(
  resolvedDisplay: KeywordBreakpoints<DisplayOption>,
  resolvedExtra: KeywordBreakpoints<T>,
  isActive: (display: DisplayOption | '') => boolean,
): KeywordBreakpoints<T> {
  const out = emptyKeywordBreakpoints<T>()
  for (const bp of BREAKPOINTS) {
    out[bp as BreakpointKey] = isActive(resolvedDisplay[bp]) ? resolvedExtra[bp] : ''
  }
  return out
}

function pushGatedFlexClasses(
  classes: string[],
  resolvedDisplay: KeywordBreakpoints<DisplayOption>,
  breakpoints: KeywordBreakpoints<string>,
  classFor: (current: string) => string | undefined,
) {
  if (!keywordHasValues(breakpoints)) return
  const gated = gateByDisplay(resolvedDisplay, resolveKeywordBreakpoints(breakpoints), isFlexDisplay)
  classes.push(...classesForKeywordChanges(gated, classFor))
}

export function applyDisplay(value: DisplayValue | null | undefined): ApplyResult {
  const merged = mergeDisplayValue(value)
  const hasDisplay = keywordHasValues(merged.breakpoints)
  const hasFlexExtras =
    keywordHasValues(merged.flexDirection) ||
    keywordHasValues(merged.flexWrap) ||
    keywordHasValues(merged.flexJustify) ||
    keywordHasValues(merged.flexAlign)
  const hasGridCols = keywordHasValues(merged.gridCols)
  if (!hasDisplay && !hasFlexExtras && !hasGridCols) {
    return emptyApplyResult()
  }

  const resolvedDisplay = resolveKeywordBreakpoints(merged.breakpoints)
  const classes: string[] = []

  if (hasDisplay) {
    classes.push(
      ...classesForKeywordChanges(resolvedDisplay, (current) => DISPLAY_CLASS[current as DisplayOption]),
    )
  }

  pushGatedFlexClasses(
    classes,
    resolvedDisplay,
    merged.flexDirection,
    (current) => FLEX_DIRECTION_CLASS[current as FlexDirectionOption],
  )
  pushGatedFlexClasses(
    classes,
    resolvedDisplay,
    merged.flexWrap,
    (current) => FLEX_WRAP_CLASS[current as FlexWrapOption],
  )
  pushGatedFlexClasses(
    classes,
    resolvedDisplay,
    merged.flexJustify,
    (current) => FLEX_JUSTIFY_CLASS[current as FlexJustifyOption],
  )
  pushGatedFlexClasses(
    classes,
    resolvedDisplay,
    merged.flexAlign,
    (current) => FLEX_ALIGN_CLASS[current as FlexAlignOption],
  )

  if (hasGridCols) {
    const gated = gateByDisplay(
      resolvedDisplay,
      resolveKeywordBreakpoints(merged.gridCols),
      isGridDisplay,
    )
    classes.push(
      ...classesForKeywordChanges(gated, (current) => GRID_COLS_CLASS[current as GridColsOption]),
    )
  }

  return {
    className: classes.filter(Boolean).join(' '),
    style: {},
    attrs: {},
  }
}

export function applyPosition(value: PositionValue | null | undefined): ApplyResult {
  const merged = mergePositionValue(value)
  if (!keywordHasValues(merged.breakpoints)) return emptyApplyResult()
  const resolved = resolveKeywordBreakpoints(merged.breakpoints)
  const classes = classesForKeywordChanges(resolved, (current) => POSITION_CLASS[current as PositionOption])
  return {
    className: classes.join(' '),
    style: {},
    attrs: {},
  }
}

export { DISPLAY_CLASS }
