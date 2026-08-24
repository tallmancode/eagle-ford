import { BREAKPOINTS } from '@/lib/blocks/v2/theme'
import type {
  AxisPair,
  BoxSides,
  BreakpointKey,
  KeywordBreakpoints,
  OverflowAxes,
} from '@/lib/blocks/v2/types'

const BOX_SIDES: (keyof BoxSides)[] = ['top', 'right', 'bottom', 'left']

export function emptySides(): BoxSides {
  return { top: '', right: '', bottom: '', left: '' }
}

export function emptyAxisPair(): AxisPair {
  return { row: '', column: '' }
}

export function emptyOverflowAxes(): OverflowAxes {
  return { x: '', y: '' }
}

export function emptyKeywordBreakpoints<T extends string>(): KeywordBreakpoints<T> {
  return { base: '', md: '', lg: '' }
}

/** Mobile-first: empty at a breakpoint keeps the last non-empty value. */
export function resolveKeywordBreakpoints<T extends string>(
  breakpoints: KeywordBreakpoints<T>,
): KeywordBreakpoints<T> {
  const out = emptyKeywordBreakpoints<T>()
  let last: T | '' = ''
  for (const bp of BREAKPOINTS) {
    const raw = breakpoints[bp]
    if (raw !== '') last = raw
    out[bp] = last
  }
  return out
}

export function resolveBoxBreakpoints(
  breakpoints: Record<BreakpointKey, BoxSides>,
): Record<BreakpointKey, BoxSides> {
  const out = {
    base: emptySides(),
    md: emptySides(),
    lg: emptySides(),
  } as Record<BreakpointKey, BoxSides>
  let last = emptySides()
  for (const bp of BREAKPOINTS) {
    const raw = breakpoints[bp] ?? emptySides()
    last = {
      top: raw.top !== '' ? raw.top : last.top,
      right: raw.right !== '' ? raw.right : last.right,
      bottom: raw.bottom !== '' ? raw.bottom : last.bottom,
      left: raw.left !== '' ? raw.left : last.left,
    }
    out[bp] = last
  }
  return out
}

export function resolveAxisBreakpoints(
  breakpoints: Record<BreakpointKey, AxisPair>,
): Record<BreakpointKey, AxisPair> {
  const out = {
    base: emptyAxisPair(),
    md: emptyAxisPair(),
    lg: emptyAxisPair(),
  } as Record<BreakpointKey, AxisPair>
  let last = emptyAxisPair()
  for (const bp of BREAKPOINTS) {
    const raw = breakpoints[bp] ?? emptyAxisPair()
    last = {
      row: raw.row !== '' ? raw.row : last.row,
      column: raw.column !== '' ? raw.column : last.column,
    }
    out[bp] = last
  }
  return out
}

export function resolveOverflowBreakpoints(
  breakpoints: Record<BreakpointKey, OverflowAxes>,
): Record<BreakpointKey, OverflowAxes> {
  const out = {
    base: emptyOverflowAxes(),
    md: emptyOverflowAxes(),
    lg: emptyOverflowAxes(),
  } as Record<BreakpointKey, OverflowAxes>
  let last = emptyOverflowAxes()
  for (const bp of BREAKPOINTS) {
    const raw = breakpoints[bp] ?? emptyOverflowAxes()
    last = {
      x: raw.x !== '' ? raw.x : last.x,
      y: raw.y !== '' ? raw.y : last.y,
    }
    out[bp] = last
  }
  return out
}

export function resolveContainerBreakpoints(
  breakpoints: Record<BreakpointKey, boolean | null>,
): Record<BreakpointKey, boolean> {
  const out = { base: false, md: false, lg: false } as Record<BreakpointKey, boolean>
  let last = false
  for (const bp of BREAKPOINTS) {
    const raw = breakpoints[bp]
    if (raw !== null && raw !== undefined) last = raw
    out[bp] = last
  }
  return out
}

export function boxHasRawValue(sides: BoxSides | undefined): boolean {
  if (!sides) return false
  return BOX_SIDES.some((side) => sides[side] !== '')
}

export function axisHasRawValue(pair: AxisPair | undefined): boolean {
  if (!pair) return false
  return pair.row !== '' || pair.column !== ''
}

export function overflowHasRawValue(axes: OverflowAxes | undefined): boolean {
  if (!axes) return false
  return axes.x !== '' || axes.y !== ''
}

export const BP_CLASS_PREFIX: Record<BreakpointKey, string> = {
  base: '',
  md: 'md:',
  lg: 'lg:',
}

/**
 * Emit a utility only when the resolved value changes from the previous breakpoint.
 * Empty resolved values are skipped.
 */
export function classesForKeywordChanges(
  resolved: KeywordBreakpoints<string>,
  classFor: (value: string) => string | undefined,
): string[] {
  const classes: string[] = []
  let previous = ''
  for (const bp of BREAKPOINTS) {
    const current = resolved[bp]
    if (current === '' || current === previous) continue
    const utility = classFor(current)
    if (!utility) continue
    classes.push(`${BP_CLASS_PREFIX[bp]}${utility}`)
    previous = current
  }
  return classes
}
