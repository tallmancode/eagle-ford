import type {
  BreakpointKey,
  ColorTokenKey,
  DeepPartial,
  DisplayOption,
  PositionOption,
  SpacingUnit,
  VisibilityOption,
} from '@/lib/blocks/v2/types'

export type V2BoxDefaults = {
  linked: boolean
  unit: SpacingUnit
}

export type V2Theme = {
  cssVarPrefix: string
  breakpoints: readonly BreakpointKey[]
  units: readonly SpacingUnit[]
  defaultUnit: SpacingUnit
  container: {
    className: string
    defaultEnabled: boolean
  }
  padding: V2BoxDefaults
  margin: V2BoxDefaults
  inset: V2BoxDefaults
  gap: V2BoxDefaults
  overflow: {
    linked: boolean
  }
  display: {
    default: DisplayOption | ''
  }
  position: {
    default: PositionOption | ''
  }
  visibility: {
    default: VisibilityOption | ''
  }
}

export type ColorTokenDef = {
  key: ColorTokenKey
  label: string
  cssVar: string
  fallback: string
}

export const COLOR_TOKENS: readonly ColorTokenDef[] = [
  { key: 'primary', label: 'Primary', cssVar: 'var(--color-primary)', fallback: '#1e1654' },
  { key: 'secondary', label: 'Secondary', cssVar: 'var(--color-secondary)', fallback: '#4b6fe8' },
  { key: 'neutral', label: 'Neutral', cssVar: 'var(--color-neutral)', fallback: '#6b6868' },
  { key: 'success', label: 'Success', cssVar: 'var(--color-success)', fallback: '#5cb8b0' },
  { key: 'danger', label: 'Danger', cssVar: 'var(--color-error)', fallback: '#e07060' },
  { key: 'warning', label: 'Warning', cssVar: 'var(--color-warning)', fallback: '#e8c96a' },
  { key: 'white', label: 'White', cssVar: '#ffffff', fallback: '#ffffff' },
  { key: 'foreground', label: 'Foreground', cssVar: 'var(--color-foreground)', fallback: '#171717' },
  { key: 'background', label: 'Background', cssVar: 'var(--color-background)', fallback: '#ffffff' },
  { key: 'border', label: 'Border', cssVar: 'var(--color-border)', fallback: '#ebebeb' },
  { key: 'muted', label: 'Muted', cssVar: 'var(--color-muted-foreground)', fallback: '#737373' },
]

export const COLOR_TOKEN_KEYS: ColorTokenKey[] = COLOR_TOKENS.map((token) => token.key)

export const COLOR_TOKEN_MAP: Record<ColorTokenKey, ColorTokenDef> = COLOR_TOKENS.reduce(
  (acc, token) => {
    acc[token.key] = token
    return acc
  },
  {} as Record<ColorTokenKey, ColorTokenDef>,
)

export const PALETTE_MAX_CUSTOM_COLORS = 24

export const BREAKPOINTS: BreakpointKey[] = ['base', 'md', 'lg']

export const SPACING_UNITS: SpacingUnit[] = ['rem', 'px', '%']

export const BREAKPOINT_META: Record<
  BreakpointKey,
  { label: string; shortLabel: string; min: string; inheritsFrom: BreakpointKey | null }
> = {
  base: { label: 'Mobile', shortLabel: 'Mobile', min: '0', inheritsFrom: null },
  md: { label: 'Tablet (≥768px)', shortLabel: 'Tablet', min: '48rem', inheritsFrom: 'base' },
  lg: { label: 'Desktop (≥1024px)', shortLabel: 'Desktop', min: '64rem', inheritsFrom: 'md' },
}

export const defaultV2Theme: V2Theme = {
  cssVarPrefix: '--v2',
  breakpoints: BREAKPOINTS,
  units: SPACING_UNITS,
  defaultUnit: 'rem',
  container: {
    className: 'container',
    defaultEnabled: false,
  },
  padding: { linked: true, unit: 'rem' },
  margin: { linked: true, unit: 'rem' },
  inset: { linked: true, unit: 'rem' },
  gap: { linked: true, unit: 'rem' },
  overflow: { linked: true },
  display: { default: '' },
  position: { default: '' },
  visibility: { default: '' },
}

function mergeBoxDefaults(base: V2BoxDefaults, overrides?: DeepPartial<V2BoxDefaults>): V2BoxDefaults {
  return {
    linked: overrides?.linked ?? base.linked,
    unit: overrides?.unit ?? base.unit,
  }
}

/** Deep-merge a partial theme onto defaults. Call-site field `defaults` should use this too. */
export function defineV2Theme(overrides?: DeepPartial<V2Theme>): V2Theme {
  if (!overrides) return defaultV2Theme
  return {
    cssVarPrefix: overrides.cssVarPrefix ?? defaultV2Theme.cssVarPrefix,
    breakpoints: overrides.breakpoints ?? defaultV2Theme.breakpoints,
    units: overrides.units ?? defaultV2Theme.units,
    defaultUnit: overrides.defaultUnit ?? defaultV2Theme.defaultUnit,
    container: {
      ...defaultV2Theme.container,
      ...overrides.container,
    },
    padding: mergeBoxDefaults(defaultV2Theme.padding, overrides.padding),
    margin: mergeBoxDefaults(defaultV2Theme.margin, overrides.margin),
    inset: mergeBoxDefaults(defaultV2Theme.inset, overrides.inset),
    gap: mergeBoxDefaults(defaultV2Theme.gap, overrides.gap),
    overflow: {
      ...defaultV2Theme.overflow,
      ...overrides.overflow,
    },
    display: {
      ...defaultV2Theme.display,
      ...overrides.display,
    },
    position: {
      ...defaultV2Theme.position,
      ...overrides.position,
    },
    visibility: {
      ...defaultV2Theme.visibility,
      ...overrides.visibility,
    },
  }
}

/**
 * Ford application-level field chrome defaults (units, linked, container class).
 * Per-block padding/margin amounts belong in `defineV2BlocksConfig` (call from `payload.config.ts`).
 * Copy `src/lib/blocks/v2` to another brand and edit both.
 */
export const v2Theme = defineV2Theme({
  container: {
    className: 'container',
    defaultEnabled: true,
  },
})
