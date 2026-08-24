import type { CSSProperties } from 'react'
import { v2Theme } from '@/lib/blocks/v2/theme'
import type { ApplyResult } from '@/lib/blocks/v2/types'

export function emptyApplyResult(): ApplyResult {
  return { className: '', style: {}, attrs: {} }
}

export function mergeApplyResults(parts: ApplyResult[]): ApplyResult {
  const classNames: string[] = []
  const style: CSSProperties = {}
  const attrs: Record<string, string> = {}

  for (const part of parts) {
    if (part.className) classNames.push(part.className)
    Object.assign(style, part.style)
    Object.assign(attrs, part.attrs)
  }

  return {
    className: classNames.join(' ').trim(),
    style,
    attrs,
  }
}

export function slotName(slot: string | undefined): string {
  const raw = (slot ?? 'root').trim() || 'root'
  return raw.replace(/[^a-zA-Z0-9_-]/g, '')
}

export function cssVar(parts: Array<string | undefined>): string {
  const prefix = v2Theme.cssVarPrefix.replace(/^--/, '')
  const tokens = [prefix, ...parts.filter((p): p is string => Boolean(p && p.length))]
  return `--${tokens.join('-')}`
}

export function setCssVar(style: CSSProperties, name: string, value: string): void {
  ;(style as Record<string, string>)[name] = value
}
