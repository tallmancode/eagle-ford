import { BREAKPOINTS, COLOR_TOKEN_KEYS, SPACING_UNITS, type V2BoxDefaults } from '@/lib/blocks/v2/theme'
import type {
  AxisPair,
  BoxSides,
  BoxValue,
  BreakpointKey,
  ColorTokenKey,
  ColorValue,
  ContainerValue,
  DisplayOption,
  DisplayValue,
  GapValue,
  OverflowAxes,
  OverflowOption,
  OverflowValue,
  PositionOption,
  PositionValue,
  SpacingUnit,
  VisibilityOption,
  VisibilityValue,
} from '@/lib/blocks/v2/types'
import { emptyAxisPair, emptyOverflowAxes, emptySides } from '@/lib/blocks/v2/apply/cascade'

export const DISPLAY_OPTIONS: DisplayOption[] = [
  'block',
  'flex',
  'inline-flex',
  'grid',
  'inline-block',
  'none',
]

export const POSITION_OPTIONS: PositionOption[] = [
  'static',
  'relative',
  'absolute',
  'sticky',
  'fixed',
]

export const OVERFLOW_OPTIONS: OverflowOption[] = ['visible', 'hidden', 'scroll', 'auto', 'clip']

export const VISIBILITY_OPTIONS: VisibilityOption[] = ['visible', 'hidden', 'invisible']

const BOX_SIDES: (keyof BoxSides)[] = ['top', 'right', 'bottom', 'left']

const UNSIGNED = /^\d+(\.\d+)?$/
const SIGNED = /^-?\d+(\.\d+)?$/

export function isSpacingUnit(value: unknown): value is SpacingUnit {
  return SPACING_UNITS.includes(value as SpacingUnit)
}

export function isValidUnsignedMeasure(value: string): boolean {
  return value === '' || UNSIGNED.test(value)
}

export function isValidSignedMeasure(value: string): boolean {
  return value === '' || SIGNED.test(value)
}

export function isValidSignedOrAuto(value: string): boolean {
  return value === '' || value === 'auto' || SIGNED.test(value)
}

function isAutoDraft(value: string): boolean {
  return /^a(u(t(o)?)?)?$/i.test(value)
}

export function emptyBoxValue(defaults: V2BoxDefaults): BoxValue {
  return {
    linked: defaults.linked,
    unit: defaults.unit,
    breakpoints: {
      base: emptySides(),
      md: emptySides(),
      lg: emptySides(),
    },
  }
}

export function emptyGapValue(defaults: V2BoxDefaults): GapValue {
  return {
    linked: defaults.linked,
    unit: defaults.unit,
    breakpoints: {
      base: emptyAxisPair(),
      md: emptyAxisPair(),
      lg: emptyAxisPair(),
    },
  }
}

export function emptyDisplayValue(): DisplayValue {
  return { breakpoints: { base: '', md: '', lg: '' } }
}

export function emptyPositionValue(): PositionValue {
  return { breakpoints: { base: '', md: '', lg: '' } }
}

export function emptyVisibilityValue(): VisibilityValue {
  return { breakpoints: { base: '', md: '', lg: '' } }
}

export function emptyOverflowValue(linked: boolean): OverflowValue {
  return {
    linked,
    breakpoints: {
      base: emptyOverflowAxes(),
      md: emptyOverflowAxes(),
      lg: emptyOverflowAxes(),
    },
  }
}

export function emptyContainerValue(defaultEnabled: boolean): ContainerValue {
  return {
    breakpoints: {
      base: defaultEnabled,
      md: null,
      lg: null,
    },
  }
}

export function emptyColorValue(defaultToken: ColorTokenKey | '' = ''): ColorValue {
  if (defaultToken) return { source: 'token', token: defaultToken, hex: '' }
  return { source: '', token: '', hex: '' }
}

export function isColorTokenKey(value: unknown): value is ColorTokenKey {
  return typeof value === 'string' && COLOR_TOKEN_KEYS.includes(value as ColorTokenKey)
}

/** Normalize #RGB / #RRGGBB to lowercase #RRGGBB. Rejects anything else. */
export function sanitizeHex(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  const trimmed = raw.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  const match = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(withHash)
  if (!match) return ''
  const digits = match[1].toLowerCase()
  if (digits.length === 3) {
    return `#${digits[0]}${digits[0]}${digits[1]}${digits[1]}${digits[2]}${digits[2]}`
  }
  return `#${digits}`
}

export function mergeColorValue(
  value: unknown,
  defaultToken: ColorTokenKey | '' = '',
): ColorValue {
  const fallback = emptyColorValue(defaultToken)
  if (value === null || value === undefined || value === '') return fallback

  if (typeof value === 'string') {
    if (value === 'default' || value === 'inherit') return emptyColorValue('')
    if (isColorTokenKey(value)) return { source: 'token', token: value, hex: '' }
    const hex = sanitizeHex(value)
    if (hex) return { source: 'custom', token: '', hex }
    return fallback
  }

  if (!isObject(value)) return fallback

  const source =
    value.source === 'token' || value.source === 'custom' || value.source === '' ? value.source : ''
  const token = isColorTokenKey(value.token) ? value.token : ''
  const hex = sanitizeHex(value.hex)

  if (source === 'token' && token) return { source: 'token', token, hex: '' }
  if (source === 'custom' && hex) return { source: 'custom', token: '', hex }
  if (source === '' && !token && !hex) return emptyColorValue('')
  if (token) return { source: 'token', token, hex: '' }
  if (hex) return { source: 'custom', token: '', hex }
  return fallback
}

export function validateColorValue(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true
  if (typeof value === 'string') {
    if (value === 'default' || value === 'inherit') return true
    if (isColorTokenKey(value)) return true
    if (sanitizeHex(value)) return true
    return 'Invalid color'
  }
  if (!isObject(value)) return 'Color must be an object'
  const keys = Object.keys(value)
  if (!keys.every((k) => k === 'source' || k === 'token' || k === 'hex')) return 'Unexpected keys'
  if (value.source !== undefined && value.source !== 'token' && value.source !== 'custom' && value.source !== '') {
    return 'Invalid color source'
  }
  if (value.token !== undefined && value.token !== '' && !isColorTokenKey(value.token)) {
    return 'Invalid color token'
  }
  if (value.hex !== undefined && value.hex !== '' && !sanitizeHex(value.hex)) {
    return 'Invalid hex color'
  }
  return true
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function asRecord(value: unknown): Record<string, unknown> {
  return isObject(value) ? value : {}
}

function normalizeSideValue(raw: unknown, allowNegative: boolean, allowAuto: boolean): string {
  if (typeof raw !== 'string') return ''
  if (allowAuto && (raw === 'auto' || isAutoDraft(raw))) return raw === 'auto' ? 'auto' : raw
  if (allowNegative) return isValidSignedMeasure(raw) ? raw : ''
  return isValidUnsignedMeasure(raw) ? raw : ''
}

function normalizeSides(
  raw: unknown,
  allowNegative: boolean,
  allowAuto: boolean,
): BoxSides {
  const out = emptySides()
  if (!isObject(raw)) return out
  for (const side of BOX_SIDES) {
    out[side] = normalizeSideValue(raw[side], allowNegative, allowAuto)
  }
  return out
}

export function mergeBoxValue(
  value: BoxValue | null | undefined,
  defaults: V2BoxDefaults,
  options: { allowNegative: boolean; allowAuto: boolean },
): BoxValue {
  const base = emptyBoxValue(defaults)
  if (!isObject(value)) return base
  const linked = typeof value.linked === 'boolean' ? value.linked : base.linked
  const unit = isSpacingUnit(value.unit) ? value.unit : base.unit
  const bpIn = asRecord(value.breakpoints)
  const breakpoints = { ...base.breakpoints }
  for (const bp of BREAKPOINTS) {
    breakpoints[bp] = normalizeSides(bpIn[bp], options.allowNegative, options.allowAuto)
  }
  return { linked, unit, breakpoints }
}

export function mergeGapValue(
  value: GapValue | null | undefined,
  defaults: V2BoxDefaults,
): GapValue {
  const base = emptyGapValue(defaults)
  if (!isObject(value)) return base
  const linked = typeof value.linked === 'boolean' ? value.linked : base.linked
  const unit = isSpacingUnit(value.unit) ? value.unit : base.unit
  const bpIn = asRecord(value.breakpoints)
  const breakpoints = { ...base.breakpoints }
  for (const bp of BREAKPOINTS) {
    const raw = bpIn[bp]
    const pair = emptyAxisPair()
    if (isObject(raw)) {
      pair.row = typeof raw.row === 'string' && isValidUnsignedMeasure(raw.row) ? raw.row : ''
      pair.column =
        typeof raw.column === 'string' && isValidUnsignedMeasure(raw.column) ? raw.column : ''
    }
    breakpoints[bp] = pair
  }
  return { linked, unit, breakpoints }
}

function mergeKeywordValue<T extends string>(
  value: { breakpoints?: KeywordBreakpointsLike } | null | undefined,
  allowed: readonly T[],
): { breakpoints: Record<BreakpointKey, T | ''> } {
  const allowedSet = new Set<string>(allowed)
  const breakpoints: Record<BreakpointKey, T | ''> = { base: '', md: '', lg: '' }
  const bpIn = asRecord(value?.breakpoints)
  for (const bp of BREAKPOINTS) {
    const raw = bpIn[bp]
    breakpoints[bp] = typeof raw === 'string' && allowedSet.has(raw) ? (raw as T) : ''
  }
  return { breakpoints }
}

type KeywordBreakpointsLike = Record<string, unknown>

export function mergeDisplayValue(value: DisplayValue | null | undefined): DisplayValue {
  return mergeKeywordValue(value, DISPLAY_OPTIONS)
}

export function mergePositionValue(value: PositionValue | null | undefined): PositionValue {
  return mergeKeywordValue(value, POSITION_OPTIONS)
}

export function mergeVisibilityValue(value: VisibilityValue | null | undefined): VisibilityValue {
  return mergeKeywordValue(value, VISIBILITY_OPTIONS)
}

export function mergeOverflowValue(
  value: OverflowValue | null | undefined,
  linkedDefault: boolean,
): OverflowValue {
  const base = emptyOverflowValue(linkedDefault)
  if (!isObject(value)) return base
  const linked = typeof value.linked === 'boolean' ? value.linked : base.linked
  const bpIn = asRecord(value.breakpoints)
  const allowed = new Set<string>(OVERFLOW_OPTIONS)
  const breakpoints = { ...base.breakpoints }
  for (const bp of BREAKPOINTS) {
    const raw = bpIn[bp]
    const axes = emptyOverflowAxes()
    if (isObject(raw)) {
      axes.x = typeof raw.x === 'string' && allowed.has(raw.x) ? (raw.x as OverflowOption) : ''
      axes.y = typeof raw.y === 'string' && allowed.has(raw.y) ? (raw.y as OverflowOption) : ''
    }
    breakpoints[bp] = axes
  }
  return { linked, breakpoints }
}

export function mergeContainerValue(
  value: ContainerValue | null | undefined,
  defaultEnabled: boolean,
): ContainerValue {
  const base = emptyContainerValue(defaultEnabled)
  if (!isObject(value)) return base
  const bpIn = asRecord(value.breakpoints)
  const breakpoints = { ...base.breakpoints }
  for (const bp of BREAKPOINTS) {
    const raw = bpIn[bp]
    if (raw === null) breakpoints[bp] = null
    else if (typeof raw === 'boolean') breakpoints[bp] = raw
  }
  return { breakpoints }
}

function validateSides(
  raw: unknown,
  check: (value: string) => boolean,
): boolean {
  if (!isObject(raw)) return false
  return BOX_SIDES.every((side) => typeof raw[side] === 'string' && check(raw[side] as string))
}

function validateBoxValue(
  value: unknown,
  check: (value: string) => boolean,
): true | string {
  if (value === null || value === undefined || value === '') return true
  if (!isObject(value)) return 'Value must be an object'
  if (value.linked !== undefined && typeof value.linked !== 'boolean') return 'Invalid linked flag'
  if (value.unit !== undefined && !isSpacingUnit(value.unit)) return 'Invalid unit'
  if (value.breakpoints !== undefined) {
    if (!isObject(value.breakpoints)) return 'Invalid breakpoints'
    for (const bp of BREAKPOINTS) {
      const sides = value.breakpoints[bp]
      if (sides !== undefined && !validateSides(sides, check)) {
        return `Invalid values for ${bp}`
      }
    }
  }
  const keys = Object.keys(value)
  if (!keys.every((k) => k === 'linked' || k === 'unit' || k === 'breakpoints')) {
    return 'Unexpected keys'
  }
  return true
}

export function validatePaddingValue(value: unknown): true | string {
  return validateBoxValue(value, isValidUnsignedMeasure)
}

export function validateMarginValue(value: unknown): true | string {
  return validateBoxValue(value, isValidSignedOrAuto)
}

export function validateInsetValue(value: unknown): true | string {
  return validateBoxValue(value, isValidSignedOrAuto)
}

export function validateGapValue(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true
  if (!isObject(value)) return 'Gap must be an object'
  if (value.linked !== undefined && typeof value.linked !== 'boolean') return 'Invalid linked flag'
  if (value.unit !== undefined && !isSpacingUnit(value.unit)) return 'Invalid unit'
  if (value.breakpoints !== undefined) {
    if (!isObject(value.breakpoints)) return 'Invalid breakpoints'
    for (const bp of BREAKPOINTS) {
      const pair = value.breakpoints[bp]
      if (pair === undefined) continue
      if (!isObject(pair)) return `Invalid gap for ${bp}`
      if (typeof pair.row !== 'string' || !isValidUnsignedMeasure(pair.row)) {
        return `Invalid row gap for ${bp}`
      }
      if (typeof pair.column !== 'string' || !isValidUnsignedMeasure(pair.column)) {
        return `Invalid column gap for ${bp}`
      }
    }
  }
  const keys = Object.keys(value)
  if (!keys.every((k) => k === 'linked' || k === 'unit' || k === 'breakpoints')) {
    return 'Unexpected keys'
  }
  return true
}

function validateKeywordValue(value: unknown, allowed: readonly string[], label: string): true | string {
  if (value === null || value === undefined || value === '') return true
  if (!isObject(value)) return `${label} must be an object`
  if (value.breakpoints !== undefined) {
    if (!isObject(value.breakpoints)) return `Invalid ${label} breakpoints`
    for (const bp of BREAKPOINTS) {
      const raw = value.breakpoints[bp]
      if (raw === undefined || raw === '') continue
      if (typeof raw !== 'string' || !allowed.includes(raw)) {
        return `Invalid ${label} for ${bp}`
      }
    }
  }
  const keys = Object.keys(value)
  if (!keys.every((k) => k === 'breakpoints')) return 'Unexpected keys'
  return true
}

export function validateDisplayValue(value: unknown): true | string {
  return validateKeywordValue(value, DISPLAY_OPTIONS, 'Display')
}

export function validatePositionValue(value: unknown): true | string {
  return validateKeywordValue(value, POSITION_OPTIONS, 'Position')
}

export function validateVisibilityValue(value: unknown): true | string {
  return validateKeywordValue(value, VISIBILITY_OPTIONS, 'Visibility')
}

export function validateOverflowValue(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true
  if (!isObject(value)) return 'Overflow must be an object'
  if (value.linked !== undefined && typeof value.linked !== 'boolean') return 'Invalid linked flag'
  if (value.breakpoints !== undefined) {
    if (!isObject(value.breakpoints)) return 'Invalid breakpoints'
    for (const bp of BREAKPOINTS) {
      const axes = value.breakpoints[bp]
      if (axes === undefined) continue
      if (!isObject(axes)) return `Invalid overflow for ${bp}`
      for (const axis of ['x', 'y'] as const) {
        const raw = axes[axis]
        if (raw === undefined || raw === '') continue
        if (typeof raw !== 'string' || !OVERFLOW_OPTIONS.includes(raw as OverflowOption)) {
          return `Invalid overflow ${axis} for ${bp}`
        }
      }
    }
  }
  const keys = Object.keys(value)
  if (!keys.every((k) => k === 'linked' || k === 'breakpoints')) return 'Unexpected keys'
  return true
}

export function validateContainerValue(value: unknown): true | string {
  if (value === null || value === undefined || value === '') return true
  if (!isObject(value)) return 'Container must be an object'
  if (value.breakpoints !== undefined) {
    if (!isObject(value.breakpoints)) return 'Invalid breakpoints'
    for (const bp of BREAKPOINTS) {
      const raw = value.breakpoints[bp]
      if (raw === undefined) continue
      if (raw !== null && typeof raw !== 'boolean') return `Invalid container for ${bp}`
    }
  }
  const keys = Object.keys(value)
  if (!keys.every((k) => k === 'breakpoints')) return 'Unexpected keys'
  return true
}

export function measureToCss(raw: string, unit: SpacingUnit): string {
  if (raw === 'auto') return 'auto'
  if (raw === '' || !SIGNED.test(raw)) return ''
  if (raw.startsWith('-') && !SIGNED.test(raw)) return ''
  return `${raw}${unit}`
}

export function sanitizeMeasureInput(
  raw: string,
  options: { allowNegative: boolean; allowAuto: boolean },
): string {
  const trimmed = raw.trim().toLowerCase()
  if (options.allowAuto && (trimmed === 'a' || trimmed === 'au' || trimmed === 'aut' || trimmed === 'auto')) {
    return trimmed === 'auto' ? 'auto' : trimmed
  }
  let next = raw.replace(/[^\d.-]/g, '')
  if (!options.allowNegative) next = next.replace(/-/g, '')
  const minus = next.startsWith('-') ? '-' : ''
  next = minus + next.replace(/-/g, '').replace(/(\..*)\./g, '$1')
  return next
}

export function boxSidesHaveValues(breakpoints: Record<BreakpointKey, BoxSides>): boolean {
  return BREAKPOINTS.some((bp) => BOX_SIDES.some((side) => breakpoints[bp][side] !== ''))
}

export function axisHasValues(breakpoints: Record<BreakpointKey, AxisPair>): boolean {
  return BREAKPOINTS.some((bp) => breakpoints[bp].row !== '' || breakpoints[bp].column !== '')
}

export function overflowHasValues(breakpoints: Record<BreakpointKey, OverflowAxes>): boolean {
  return BREAKPOINTS.some((bp) => breakpoints[bp].x !== '' || breakpoints[bp].y !== '')
}

export function keywordHasValues<T extends string>(
  breakpoints: Record<BreakpointKey, T | ''>,
): boolean {
  return BREAKPOINTS.some((bp) => breakpoints[bp] !== '')
}
