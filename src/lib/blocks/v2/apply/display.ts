import type { DisplayOption, DisplayValue, PositionOption, PositionValue } from '@/lib/blocks/v2/types'
import { classesForKeywordChanges, resolveKeywordBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import { emptyApplyResult } from '@/lib/blocks/v2/apply/result'
import {
  keywordHasValues,
  mergeDisplayValue,
  mergePositionValue,
} from '@/lib/blocks/v2/apply/values'
import type { ApplyResult } from '@/lib/blocks/v2/types'

const DISPLAY_CLASS: Record<DisplayOption, string> = {
  block: 'block',
  flex: 'flex',
  'inline-flex': 'inline-flex',
  grid: 'grid',
  'inline-block': 'inline-block',
  none: 'hidden',
}

const POSITION_CLASS: Record<PositionOption, string> = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  sticky: 'sticky',
  fixed: 'fixed',
}

export function applyDisplay(value: DisplayValue | null | undefined): ApplyResult {
  const merged = mergeDisplayValue(value)
  if (!keywordHasValues(merged.breakpoints)) return emptyApplyResult()
  const resolved = resolveKeywordBreakpoints(merged.breakpoints)
  const classes = classesForKeywordChanges(resolved, (current) => DISPLAY_CLASS[current as DisplayOption])
  return {
    className: classes.join(' '),
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
