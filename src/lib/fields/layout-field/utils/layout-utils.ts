/** Shared types and helpers for layout spacing (admin JSON field + frontend CSS vars). */

export type SpacingUnit = 'px' | 'rem' | 'em' | '%'

export type SpacingBreakpointKey = 'base' | 'md' | 'lg'

export type SpacingSides = {
  top: string
  right: string
  bottom: string
  left: string
}

export type SpacingAxis = {
  linked: boolean
  unit: SpacingUnit
  breakpoints: Record<SpacingBreakpointKey, SpacingSides>
}

export type LayoutSpacingValue = {
  padding?: SpacingAxis
  margin?: SpacingAxis
}

export const DEFAULT_SPACING_UNIT: SpacingUnit = 'rem'

export const SPACING_UNITS: SpacingUnit[] = ['rem', 'px', 'em', '%']

export const SPACING_BREAKPOINTS: SpacingBreakpointKey[] = ['base', 'md', 'lg']

const emptySides = (): SpacingSides => ({
  top: '',
  right: '',
  bottom: '',
  left: '',
})

export const emptySpacingAxis = (): SpacingAxis => ({
  linked: true,
  unit: DEFAULT_SPACING_UNIT,
  breakpoints: {
    base: emptySides(),
    md: emptySides(),
    lg: emptySides(),
  },
})

export const emptyLayoutSpacingValue = (): LayoutSpacingValue => ({
  padding: emptySpacingAxis(),
  margin: emptySpacingAxis(),
})

/** Default stored shape respecting excluded axes (omit keys entirely when excluded). */
export function defaultLayoutSpacingForExclude(
  exclude?: ('padding' | 'margin')[],
): LayoutSpacingValue {
  const ex = new Set(exclude ?? [])
  const v: LayoutSpacingValue = {}
  if (!ex.has('padding')) v.padding = emptySpacingAxis()
  if (!ex.has('margin')) v.margin = emptySpacingAxis()
  return v
}

const SIDE_KEYS = ['top', 'right', 'bottom', 'left'] as const

/** Numeric string or empty; avoids injecting arbitrary CSS into style attributes. */
const SIDE_VALUE_PATTERN = /^$|^\d+(\.\d+)?$/

function isSpacingUnit(u: unknown): u is SpacingUnit {
  return u === 'px' || u === 'rem' || u === 'em' || u === '%'
}

function isValidSides(s: unknown): boolean {
  if (!s || typeof s !== 'object') return false
  for (const k of SIDE_KEYS) {
    const v = (s as Record<string, unknown>)[k]
    if (typeof v !== 'string' || !SIDE_VALUE_PATTERN.test(v)) return false
  }
  return true
}

function isValidSpacingAxis(axis: unknown): boolean {
  if (!axis || typeof axis !== 'object') return false
  const a = axis as Record<string, unknown>
  if (typeof a.linked !== 'boolean') return false
  if (!isSpacingUnit(a.unit)) return false
  const bp = a.breakpoints
  if (!bp || typeof bp !== 'object') return false
  for (const key of SPACING_BREAKPOINTS) {
    if (!isValidSides((bp as Record<string, unknown>)[key])) return false
  }
  return true
}

/**
 * Validates stored JSON for the spacing field.
 * Returns an error message string or `true` when valid.
 */
export function validateLayoutSpacingValue(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'object' || Array.isArray(value)) {
    return 'Spacing must be an object'
  }
  const v = value as Record<string, unknown>
  if (v.padding !== undefined && !isValidSpacingAxis(v.padding)) {
    return 'Invalid padding configuration'
  }
  if (v.margin !== undefined && !isValidSpacingAxis(v.margin)) {
    return 'Invalid margin configuration'
  }
  const keys = Object.keys(v)
  const allowed = keys.every((k) => k === 'padding' || k === 'margin')
  if (!allowed) return 'Unexpected keys in spacing value'
  return true
}

function normalizeSides(raw: unknown): SpacingSides {
  const e = emptySides()
  if (!raw || typeof raw !== 'object') return e
  const o = raw as Record<string, unknown>
  for (const k of SIDE_KEYS) {
    const val = o[k]
    e[k] = typeof val === 'string' && SIDE_VALUE_PATTERN.test(val) ? val : ''
  }
  return e
}

function normalizeAxis(raw: unknown): SpacingAxis {
  const defaults = emptySpacingAxis()
  if (!raw || typeof raw !== 'object') return defaults
  const o = raw as Record<string, unknown>
  const linked = typeof o.linked === 'boolean' ? o.linked : defaults.linked
  const unit = isSpacingUnit(o.unit) ? o.unit : defaults.unit
  const bpIn = o.breakpoints
  const breakpoints: SpacingAxis['breakpoints'] = { ...defaults.breakpoints }
  if (bpIn && typeof bpIn === 'object' && !Array.isArray(bpIn)) {
    for (const key of SPACING_BREAKPOINTS) {
      breakpoints[key] = normalizeSides((bpIn as Record<string, unknown>)[key])
    }
  }
  return { linked, unit, breakpoints }
}

/** Deep-merge partial stored values with defaults (safe for admin UI + frontend reads). */
export function mergeLayoutSpacingWithDefaults(
  value: LayoutSpacingValue | null | undefined,
  exclude?: ('padding' | 'margin')[],
): LayoutSpacingValue {
  const ex = new Set(exclude ?? [])
  const out: LayoutSpacingValue = {}
  if (!ex.has('padding')) {
    out.padding = normalizeAxis(value?.padding ?? emptySpacingAxis())
  }
  if (!ex.has('margin')) {
    out.margin = normalizeAxis(value?.margin ?? emptySpacingAxis())
  }
  return out
}
