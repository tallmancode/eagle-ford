import { COLOR_TOKEN_MAP } from '@/lib/blocks/v2/theme'
import { emptyApplyResult } from '@/lib/blocks/v2/apply/result'
import { mergeColorValue } from '@/lib/blocks/v2/apply/values'
import type { ApplyResult, ColorCssProperty, ColorTokenKey } from '@/lib/blocks/v2/types'

export type ApplyColorOptions = {
  property: ColorCssProperty
}

function tokenToCss(tokenKey: ColorTokenKey): string {
  const token = COLOR_TOKEN_MAP[tokenKey]
  if (token.cssVar.startsWith('#')) return token.cssVar
  if (token.cssVar.startsWith('var(') && token.cssVar.endsWith(')')) {
    return `${token.cssVar.slice(0, -1)}, ${token.fallback})`
  }
  return token.cssVar
}

export function resolveColorCss(value: unknown, defaultToken: ColorTokenKey | '' = ''): string | undefined {
  const merged = mergeColorValue(value, defaultToken)
  if (merged.source === 'token' && merged.token) return tokenToCss(merged.token)
  if (merged.source === 'custom' && merged.hex) return merged.hex
  return undefined
}

export function applyColor(
  value: unknown,
  options: ApplyColorOptions,
  defaultToken: ColorTokenKey | '' = '',
): ApplyResult {
  const css = resolveColorCss(value, defaultToken)
  if (!css) return emptyApplyResult()
  return {
    className: '',
    style: { [options.property]: css },
    attrs: {},
  }
}
