import type { CSSProperties } from 'react'
import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import type { ApplyOptions, ApplyResult, BoxKind, BoxValue, BreakpointKey } from '@/lib/blocks/v2/types'
import { resolveBoxBreakpoints } from '@/lib/blocks/v2/apply/cascade'
import { cssVar, emptyApplyResult, setCssVar, slotName } from '@/lib/blocks/v2/apply/result'
import {
  boxSidesHaveValues,
  measureToCss,
  mergeBoxValue,
} from '@/lib/blocks/v2/apply/values'
import { v2Theme } from '@/lib/blocks/v2/theme'

const KIND_SHORT: Record<BoxKind, string> = {
  padding: 'pad',
  margin: 'mar',
  inset: 'pin',
}

const KIND_ATTR: Record<BoxKind, string> = {
  padding: 'data-v2-pad',
  margin: 'data-v2-mar',
  inset: 'data-v2-inset',
}

/* Marker classes only — box.css targets data-v2-* attributes, not these. */
const KIND_CLASS: Record<BoxKind, string> = {
  padding: 'v2-box-padding',
  margin: 'v2-box-margin',
  inset: 'v2-box-offsets',
}

function bpSuffix(bp: BreakpointKey): string {
  return bp === 'base' ? '' : `-${bp}`
}

export function applyBox(
  kind: BoxKind,
  value: BoxValue | null | undefined,
  options?: ApplyOptions,
): ApplyResult {
  const defaults = v2Theme[kind]
  const allowNegative = kind !== 'padding'
  const allowAuto = kind !== 'padding'
  const merged = mergeBoxValue(value, defaults, { allowNegative, allowAuto })
  if (!boxSidesHaveValues(merged.breakpoints)) return emptyApplyResult()

  const slot = slotName(options?.slot)
  const short = KIND_SHORT[kind]
  const resolved = resolveBoxBreakpoints(merged.breakpoints)
  const style: CSSProperties = {}
  const sides = ['top', 'right', 'bottom', 'left'] as const

  for (const bp of BREAKPOINTS) {
    const raw = merged.breakpoints[bp]
    for (const side of sides) {
      if (raw[side] === '') continue
      const cssValue = measureToCss(resolved[bp][side], merged.unit)
      if (!cssValue) continue
      const generic = cssVar([short, side]) + bpSuffix(bp)
      const namespaced = cssVar([slot, short, side]) + bpSuffix(bp)
      setCssVar(style, generic, cssValue)
      setCssVar(style, namespaced, cssValue)
    }
  }

  return {
    className: KIND_CLASS[kind],
    style,
    attrs: { [KIND_ATTR[kind]]: slot },
  }
}

export function applyPadding(value: BoxValue | null | undefined, options?: ApplyOptions): ApplyResult {
  return applyBox('padding', value, options)
}

export function applyMargin(value: BoxValue | null | undefined, options?: ApplyOptions): ApplyResult {
  return applyBox('margin', value, options)
}

export function applyInset(value: BoxValue | null | undefined, options?: ApplyOptions): ApplyResult {
  return applyBox('inset', value, options)
}
