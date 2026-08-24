import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import type { ApplyResult, OverflowOption, OverflowValue } from '@/lib/blocks/v2/types'
import { BP_CLASS_PREFIX, resolveOverflowBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import { emptyApplyResult } from '@/lib/blocks/v2/apply/result'
import { mergeOverflowValue, overflowHasValues } from '@/lib/blocks/v2/apply/values'
import { v2Theme } from '@/lib/blocks/v2/theme'

function overflowUtility(axis: 'both' | 'x' | 'y', value: OverflowOption): string {
  if (axis === 'both') return `overflow-${value}`
  return `overflow-${axis}-${value}`
}

export function applyOverflow(value: OverflowValue | null | undefined): ApplyResult {
  const merged = mergeOverflowValue(value, v2Theme.overflow.linked)
  if (!overflowHasValues(merged.breakpoints)) return emptyApplyResult()

  const resolved = resolveOverflowBreakpoints(merged.breakpoints)
  const classes: string[] = []
  let prevX: OverflowOption | '' = ''
  let prevY: OverflowOption | '' = ''

  for (const bp of BREAKPOINTS) {
    const current = resolved[bp]
    const prefix = BP_CLASS_PREFIX[bp]
    const x = current.x
    const y = current.y

    if (x !== '' && y !== '' && x === y) {
      if (x !== prevX || y !== prevY) {
        classes.push(`${prefix}${overflowUtility('both', x)}`)
        prevX = x
        prevY = y
      }
      continue
    }

    if (x !== '' && x !== prevX) {
      classes.push(`${prefix}${overflowUtility('x', x)}`)
      prevX = x
    }
    if (y !== '' && y !== prevY) {
      classes.push(`${prefix}${overflowUtility('y', y)}`)
      prevY = y
    }
  }

  return {
    className: classes.join(' '),
    style: {},
    attrs: {},
  }
}
