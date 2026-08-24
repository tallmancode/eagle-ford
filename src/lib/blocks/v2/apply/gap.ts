import type { CSSProperties } from 'react'
import { v2Theme } from '@/lib/blocks/v2/theme'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import type { ApplyOptions, ApplyResult, BreakpointKey, GapValue } from '@/lib/blocks/v2/types'
import { resolveAxisBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import { cssVar, emptyApplyResult, setCssVar, slotName } from '@/lib/blocks/v2/apply/result'
import { axisHasValues, measureToCss, mergeGapValue } from '@/lib/blocks/v2/apply/values'

function bpSuffix(bp: BreakpointKey): string {
  return bp === 'base' ? '' : `-${bp}`
}

export function applyGap(value: GapValue | null | undefined, options?: ApplyOptions): ApplyResult {
  const merged = mergeGapValue(value, v2Theme.gap)
  if (!axisHasValues(merged.breakpoints)) return emptyApplyResult()

  const slot = slotName(options?.slot)
  const resolved = resolveAxisBreakpoints(merged.breakpoints)
  const style: CSSProperties = {}

  for (const bp of BREAKPOINTS) {
    const raw = merged.breakpoints[bp]
    for (const axis of ['row', 'column'] as const) {
      if (raw[axis] === '') continue
      const cssValue = measureToCss(resolved[bp][axis], merged.unit)
      if (!cssValue) continue
      const generic = cssVar(['gap', axis]) + bpSuffix(bp)
      const namespaced = cssVar([slot, 'gap', axis]) + bpSuffix(bp)
      setCssVar(style, generic, cssValue)
      setCssVar(style, namespaced, cssValue)
    }
  }

  return {
    className: 'v2-box-gap',
    style,
    attrs: { 'data-v2-gap': slot },
  }
}
