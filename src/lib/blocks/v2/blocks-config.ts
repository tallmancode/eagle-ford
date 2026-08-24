import { emptyBoxValue, emptyContainerValue } from '@/lib/blocks/v2/apply/values'
import { emptySides } from '@/lib/blocks/v2/apply/cascade'
import { v2Theme } from '@/lib/blocks/v2/theme'
import type {
  BoxSide,
  BoxSides,
  BoxValue,
  BreakpointKey,
  ContainerValue,
  DeepPartial,
  SpacingUnit,
} from '@/lib/blocks/v2/types'

/** Friendly aliases accepted in app config (map onto stored `base` / `md` / `lg`). */
export type ConfigBreakpointKey = BreakpointKey | 'mobile' | 'tablet' | 'desktop'

export type BoxSidesInput = Partial<Record<BoxSide, string>>

export type BoxStyleDefaultsInput = {
  linked?: boolean
  unit?: SpacingUnit
} & Partial<Record<ConfigBreakpointKey, BoxSidesInput>>

export type ContainerStyleDefaultsInput = {
  /** Prefer this name (matches `v2Theme.container`). */
  defaultEnabled?: boolean
  /** Alias of `defaultEnabled` (matches `ContainerField({ defaults: { enabled } })`). */
  enabled?: boolean
}

export type V2BlockStyleDefaults = {
  padding?: BoxStyleDefaultsInput
  margin?: BoxStyleDefaultsInput
  inset?: BoxStyleDefaultsInput
  container?: ContainerStyleDefaultsInput
}

/** Keys used in `defineV2BlocksConfig` — match block role, not Payload slug. */
export type V2BlockConfigKey = 'sectionBlock' | 'wrapperBlock'

export type V2BlocksConfig = Partial<Record<V2BlockConfigKey, V2BlockStyleDefaults>>

const BREAKPOINT_ALIASES: Record<ConfigBreakpointKey, BreakpointKey> = {
  base: 'base',
  mobile: 'base',
  md: 'md',
  tablet: 'md',
  lg: 'lg',
  desktop: 'lg',
}

const BOX_SIDES: BoxSide[] = ['top', 'right', 'bottom', 'left']

let blocksConfig: V2BlocksConfig = {}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeSides(base: BoxSides, override?: BoxSidesInput): BoxSides {
  if (!override) return base
  const out = { ...base }
  for (const side of BOX_SIDES) {
    const next = override[side]
    if (typeof next === 'string') out[side] = next
  }
  return out
}

function distinctNonEmptySides(sides: BoxSides): string[] {
  return BOX_SIDES.map((side) => sides[side]).filter((value) => value !== '')
}

function inferLinked(breakpoints: BoxValue['breakpoints'], preferred: boolean): boolean {
  const values = new Set<string>()
  for (const bp of Object.values(breakpoints)) {
    for (const value of distinctNonEmptySides(bp)) values.add(value)
  }
  if (values.size > 1) return false
  const hasPartial =
    Object.values(breakpoints).some((sides) => {
      const filled = distinctNonEmptySides(sides).length
      return filled > 0 && filled < 4
    })
  if (hasPartial) return false
  return preferred
}

/** Turn a config padding/margin shape into a stored `BoxValue` default. */
export function boxValueFromStyleDefaults(
  input: BoxStyleDefaultsInput | undefined,
  themeBox: { linked: boolean; unit: SpacingUnit },
): BoxValue {
  const linkedPreferred = input?.linked ?? themeBox.linked
  const unit = input?.unit ?? themeBox.unit
  const base = emptyBoxValue({ linked: linkedPreferred, unit })

  if (!input) return base

  const breakpoints = {
    base: mergeSides(emptySides(), undefined),
    md: mergeSides(emptySides(), undefined),
    lg: mergeSides(emptySides(), undefined),
  }

  for (const [key, sides] of Object.entries(input)) {
    if (key === 'linked' || key === 'unit') continue
    const bp = BREAKPOINT_ALIASES[key as ConfigBreakpointKey]
    if (!bp || !isObject(sides)) continue
    breakpoints[bp] = mergeSides(breakpoints[bp], sides as BoxSidesInput)
  }

  return {
    linked: inferLinked(breakpoints, linkedPreferred),
    unit,
    breakpoints,
  }
}

export function getV2BlocksConfig(): V2BlocksConfig {
  return blocksConfig
}

export function getV2BlockStyleDefaults(block: V2BlockConfigKey): V2BlockStyleDefaults | undefined {
  return blocksConfig[block]
}

export function getV2BlockBoxDefault(
  block: V2BlockConfigKey,
  kind: 'padding' | 'margin' | 'inset',
): BoxValue {
  const themeBox = v2Theme[kind]
  const input = blocksConfig[block]?.[kind]
  return boxValueFromStyleDefaults(input, themeBox)
}

export function getV2BlockContainerEnabled(block: V2BlockConfigKey): boolean {
  const input = blocksConfig[block]?.container
  if (typeof input?.defaultEnabled === 'boolean') return input.defaultEnabled
  if (typeof input?.enabled === 'boolean') return input.enabled
  return v2Theme.container.defaultEnabled
}

export function getV2BlockContainerDefault(block: V2BlockConfigKey): ContainerValue {
  return emptyContainerValue(getV2BlockContainerEnabled(block))
}

/**
 * App-level per-block style defaults (Nuxt-style). Call from `payload.config.ts`
 * before `buildConfig` — Payload itself has no slot for this; the singleton is
 * read when field `defaultValue` runs (new blocks) and by `StyleFields({ block })`.
 *
 * @example
 * defineV2BlocksConfig({
 *   sectionBlock: {
 *     padding: {
 *       mobile: { top: '1', bottom: '1' },
 *     },
 *     container: { defaultEnabled: true },
 *   },
 * })
 */
export function defineV2BlocksConfig(config: DeepPartial<V2BlocksConfig> | V2BlocksConfig): V2BlocksConfig {
  blocksConfig = {
    sectionBlock: mergeBlockDefaults(blocksConfig.sectionBlock, config.sectionBlock),
    wrapperBlock: mergeBlockDefaults(blocksConfig.wrapperBlock, config.wrapperBlock),
  }
  return blocksConfig
}

function mergeBlockDefaults(
  base: V2BlockStyleDefaults | undefined,
  override: DeepPartial<V2BlockStyleDefaults> | V2BlockStyleDefaults | undefined,
): V2BlockStyleDefaults | undefined {
  if (!base && !override) return undefined
  return {
    padding: mergeStyleInput(base?.padding, override?.padding),
    margin: mergeStyleInput(base?.margin, override?.margin),
    inset: mergeStyleInput(base?.inset, override?.inset),
    container: mergeContainerInput(base?.container, override?.container),
  }
}

function mergeContainerInput(
  base: ContainerStyleDefaultsInput | undefined,
  override: DeepPartial<ContainerStyleDefaultsInput> | ContainerStyleDefaultsInput | undefined,
): ContainerStyleDefaultsInput | undefined {
  if (!base && !override) return undefined
  return { ...base, ...override }
}

function mergeStyleInput(
  base: BoxStyleDefaultsInput | undefined,
  override: DeepPartial<BoxStyleDefaultsInput> | BoxStyleDefaultsInput | undefined,
): BoxStyleDefaultsInput | undefined {
  if (!base && !override) return undefined
  return { ...base, ...override } as BoxStyleDefaultsInput
}

/** Test helper — reset singleton between specs. */
export function resetV2BlocksConfig(): void {
  blocksConfig = {}
}
