/** Shared types and helpers for layout spacing (admin JSON field + frontend CSS vars). */

import type { CSSProperties } from 'react'

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

// --- Flex layout ---

export type FlexDirection = 'row' | 'column'
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'

export type FlexBreakpointSettings = {
  direction: FlexDirection | ''
  justifyContent: FlexJustify | ''
  alignItems: FlexAlign | ''
  gap: string
}

export type FlexLayoutValue = {
  gapUnit: SpacingUnit
  breakpoints: Record<SpacingBreakpointKey, FlexBreakpointSettings>
}

export const FLEX_DIRECTIONS: FlexDirection[] = ['row', 'column']
export const FLEX_JUSTIFY_OPTIONS: FlexJustify[] = [
  'start',
  'center',
  'end',
  'between',
  'around',
  'evenly',
]
export const FLEX_ALIGN_OPTIONS: FlexAlign[] = ['start', 'center', 'end', 'stretch', 'baseline']

const emptyFlexBreakpointSettings = (): FlexBreakpointSettings => ({
  direction: '',
  justifyContent: '',
  alignItems: '',
  gap: '',
})

export const emptyFlexLayoutValue = (): FlexLayoutValue => ({
  gapUnit: DEFAULT_SPACING_UNIT,
  breakpoints: {
    base: emptyFlexBreakpointSettings(),
    md: emptyFlexBreakpointSettings(),
    lg: emptyFlexBreakpointSettings(),
  },
})

export const defaultFlexLayoutValue = (): FlexLayoutValue => emptyFlexLayoutValue()

function isFlexDirection(v: unknown): v is FlexDirection {
  return v === 'row' || v === 'column'
}

function isFlexJustify(v: unknown): v is FlexJustify {
  return (
    v === 'start' ||
    v === 'center' ||
    v === 'end' ||
    v === 'between' ||
    v === 'around' ||
    v === 'evenly'
  )
}

function isFlexAlign(v: unknown): v is FlexAlign {
  return v === 'start' || v === 'center' || v === 'end' || v === 'stretch' || v === 'baseline'
}

function isValidFlexBreakpointSettings(s: unknown): boolean {
  if (!s || typeof s !== 'object') return false
  const o = s as Record<string, unknown>
  const dir = o.direction
  if (dir !== '' && dir !== undefined && !isFlexDirection(dir)) return false
  const justify = o.justifyContent
  if (justify !== '' && justify !== undefined && !isFlexJustify(justify)) return false
  const align = o.alignItems
  if (align !== '' && align !== undefined && !isFlexAlign(align)) return false
  const gap = o.gap
  if (typeof gap !== 'string' || !SIDE_VALUE_PATTERN.test(gap)) return false
  return true
}

/**
 * Validates stored JSON for the flex field.
 * Returns an error message string or `true` when valid.
 */
export function validateFlexLayoutValue(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'object' || Array.isArray(value)) {
    return 'Flex layout must be an object'
  }
  const v = value as Record<string, unknown>
  if (v.gapUnit !== undefined && !isSpacingUnit(v.gapUnit)) {
    return 'Invalid gap unit'
  }
  const bp = v.breakpoints
  if (bp !== undefined) {
    if (!bp || typeof bp !== 'object' || Array.isArray(bp)) {
      return 'Invalid flex breakpoints'
    }
    for (const key of SPACING_BREAKPOINTS) {
      const settings = (bp as Record<string, unknown>)[key]
      if (settings !== undefined && !isValidFlexBreakpointSettings(settings)) {
        return `Invalid flex configuration for ${key}`
      }
    }
  }
  const keys = Object.keys(v)
  const allowed = keys.every((k) => k === 'gapUnit' || k === 'breakpoints')
  if (!allowed) return 'Unexpected keys in flex layout value'
  return true
}

function normalizeFlexBreakpointSettings(raw: unknown): FlexBreakpointSettings {
  const defaults = emptyFlexBreakpointSettings()
  if (!raw || typeof raw !== 'object') return defaults
  const o = raw as Record<string, unknown>
  const direction =
    o.direction === '' || o.direction === undefined
      ? ''
      : isFlexDirection(o.direction)
        ? o.direction
        : ''
  const justifyContent =
    o.justifyContent === '' || o.justifyContent === undefined
      ? ''
      : isFlexJustify(o.justifyContent)
        ? o.justifyContent
        : ''
  const alignItems =
    o.alignItems === '' || o.alignItems === undefined
      ? ''
      : isFlexAlign(o.alignItems)
        ? o.alignItems
        : ''
  const gap = typeof o.gap === 'string' && SIDE_VALUE_PATTERN.test(o.gap) ? o.gap : defaults.gap
  return { direction, justifyContent, alignItems, gap }
}

/** Deep-merge partial stored values with defaults (safe for admin UI + frontend reads). */
export function mergeFlexLayoutWithDefaults(
  value: FlexLayoutValue | null | undefined,
): FlexLayoutValue {
  const defaults = emptyFlexLayoutValue()
  if (!value || typeof value !== 'object') return defaults
  const gapUnit = isSpacingUnit(value.gapUnit) ? value.gapUnit : defaults.gapUnit
  const breakpoints: FlexLayoutValue['breakpoints'] = { ...defaults.breakpoints }
  const bpIn = value.breakpoints
  if (bpIn && typeof bpIn === 'object' && !Array.isArray(bpIn)) {
    for (const key of SPACING_BREAKPOINTS) {
      breakpoints[key] = normalizeFlexBreakpointSettings((bpIn as Record<string, unknown>)[key])
    }
  }
  return { gapUnit, breakpoints }
}

/** True when at least one breakpoint has flex direction set. */
export function flexLayoutHasConfig(value: FlexLayoutValue | null | undefined): boolean {
  const merged = mergeFlexLayoutWithDefaults(value)
  return SPACING_BREAKPOINTS.some((bp) => merged.breakpoints[bp].direction !== '')
}

function resolveEffectiveFlexBreakpoints(
  value: FlexLayoutValue,
): Record<SpacingBreakpointKey, FlexBreakpointSettings> {
  const merged = mergeFlexLayoutWithDefaults(value)
  const out = {} as Record<SpacingBreakpointKey, FlexBreakpointSettings>
  let lastDirection: FlexDirection | '' = ''
  let lastJustify: FlexJustify | '' = ''
  let lastAlign: FlexAlign | '' = ''
  let lastGap = ''

  for (const bp of SPACING_BREAKPOINTS) {
    const raw = merged.breakpoints[bp]
    if (raw.direction !== '') lastDirection = raw.direction
    if (raw.justifyContent !== '') lastJustify = raw.justifyContent
    if (raw.alignItems !== '') lastAlign = raw.alignItems
    if (raw.gap !== '') lastGap = raw.gap
    out[bp] = {
      direction: lastDirection,
      justifyContent: lastJustify,
      alignItems: lastAlign,
      gap: lastGap,
    }
  }
  return out
}

const DIRECTION_CLASS: Record<FlexDirection, string> = {
  row: 'flex-row',
  column: 'flex-col',
}

const JUSTIFY_CLASS: Record<FlexJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const ALIGN_CLASS: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const BP_PREFIX: Record<SpacingBreakpointKey, string> = {
  base: '',
  md: 'md:',
  lg: 'lg:',
}

function pushResponsiveClass(
  classes: string[],
  bp: SpacingBreakpointKey,
  utility: string,
  current: string,
  previous: string,
) {
  if (current === previous || current === '') return
  const prefix = BP_PREFIX[bp]
  classes.push(`${prefix}${utility}`)
}

/** Builds responsive Tailwind classes for flex layout. Returns empty string when no direction is set. */
export function flexLayoutToClassName(value: FlexLayoutValue | null | undefined): string {
  if (!flexLayoutHasConfig(value)) return ''
  const merged = mergeFlexLayoutWithDefaults(value!)
  const effective = resolveEffectiveFlexBreakpoints(merged)
  const classes: string[] = ['flex']

  let prevDirection = ''
  let prevJustify = ''
  let prevAlign = ''

  for (const bp of SPACING_BREAKPOINTS) {
    const settings = effective[bp]
    if (settings.direction !== '') {
      pushResponsiveClass(
        classes,
        bp,
        DIRECTION_CLASS[settings.direction],
        settings.direction,
        prevDirection,
      )
      prevDirection = settings.direction
    }
    if (settings.justifyContent !== '') {
      pushResponsiveClass(
        classes,
        bp,
        JUSTIFY_CLASS[settings.justifyContent],
        settings.justifyContent,
        prevJustify,
      )
      prevJustify = settings.justifyContent
    }
    if (settings.alignItems !== '') {
      pushResponsiveClass(
        classes,
        bp,
        ALIGN_CLASS[settings.alignItems],
        settings.alignItems,
        prevAlign,
      )
      prevAlign = settings.alignItems
    }
  }

  return classes.join(' ')
}

export function flexLayoutHasGap(value: FlexLayoutValue | null | undefined): boolean {
  const effective = resolveEffectiveFlexBreakpoints(mergeFlexLayoutWithDefaults(value))
  return SPACING_BREAKPOINTS.some((bp) => effective[bp].gap !== '')
}

/** Maps flex gap to CSS custom properties consumed by `.section-layout-flex-gap`. */
export function flexLayoutGapToCssVars(value: FlexLayoutValue | null | undefined): CSSProperties {
  if (!flexLayoutHasGap(value)) return {}
  const merged = mergeFlexLayoutWithDefaults(value)
  const effective = resolveEffectiveFlexBreakpoints(merged)
  const out: Record<string, string> = {}

  for (const bp of SPACING_BREAKPOINTS) {
    const gap = effective[bp].gap
    if (gap === '') continue
    const cssVal = `${gap}${merged.gapUnit}`
    const key = bp === 'base' ? '--section-flex-gap' : `--section-flex-gap-${bp}`
    out[key] = cssVal
  }

  return out as CSSProperties
}

// --- Visibility layout ---

export type LayoutVisibilityHideAt = Partial<Record<SpacingBreakpointKey, boolean>>

export type LayoutVisibilityValue = {
  hideAt?: LayoutVisibilityHideAt
}

export const defaultLayoutVisibilityValue = (): LayoutVisibilityValue => ({
  hideAt: {
    base: false,
    md: false,
    lg: false,
  },
})

function isValidHideAt(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const o = value as Record<string, unknown>
  for (const key of Object.keys(o)) {
    if (!SPACING_BREAKPOINTS.includes(key as SpacingBreakpointKey)) return false
    if (typeof o[key] !== 'boolean') return false
  }
  return true
}

/**
 * Validates stored JSON for the visibility field.
 * Returns an error message string or `true` when valid.
 */
export function validateLayoutVisibilityValue(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true
  if (typeof value !== 'object' || Array.isArray(value)) {
    return 'Visibility must be an object'
  }
  const v = value as Record<string, unknown>
  if (v.hideAt !== undefined && !isValidHideAt(v.hideAt)) {
    return 'Invalid visibility configuration'
  }
  const keys = Object.keys(v)
  const allowed = keys.every((k) => k === 'hideAt')
  if (!allowed) return 'Unexpected keys in visibility value'
  return true
}

export function mergeLayoutVisibilityWithDefaults(
  value: LayoutVisibilityValue | null | undefined,
): LayoutVisibilityValue {
  const defaults = defaultLayoutVisibilityValue()
  const hideAtIn = value?.hideAt
  const hideAt: LayoutVisibilityHideAt = { ...defaults.hideAt }
  if (hideAtIn && typeof hideAtIn === 'object' && !Array.isArray(hideAtIn)) {
    for (const key of SPACING_BREAKPOINTS) {
      const raw = (hideAtIn as Record<string, unknown>)[key]
      if (typeof raw === 'boolean') hideAt[key] = raw
    }
  }
  return { hideAt }
}

/** True when at least one breakpoint is set to hidden. */
export function layoutVisibilityHasConfig(
  value: LayoutVisibilityValue | null | undefined,
): boolean {
  const merged = mergeLayoutVisibilityWithDefaults(value)
  return SPACING_BREAKPOINTS.some((bp) => merged.hideAt?.[bp] === true)
}

/** Builds responsive Tailwind classes to hide/show the section per breakpoint. */
export function layoutVisibilityToClassName(
  value: LayoutVisibilityValue | null | undefined,
): string {
  if (!layoutVisibilityHasConfig(value)) return ''

  const merged = mergeLayoutVisibilityWithDefaults(value)
  const visible = {
    base: merged.hideAt?.base !== true,
    md: merged.hideAt?.md !== true,
    lg: merged.hideAt?.lg !== true,
  }

  if (visible.base && visible.md && visible.lg) return ''
  if (!visible.base && !visible.md && !visible.lg) return 'hidden'

  const classes: string[] = []

  if (!visible.base) classes.push('hidden')

  if (visible.md !== visible.base) {
    classes.push(visible.md ? 'md:block' : 'md:hidden')
  }
  if (visible.lg !== visible.md) {
    classes.push(visible.lg ? 'lg:block' : 'lg:hidden')
  }

  return classes.join(' ')
}
