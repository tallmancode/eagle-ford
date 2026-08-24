import { PALETTE_MAX_CUSTOM_COLORS } from '@/lib/blocks/v2/theme'
import { sanitizeHex } from '@/lib/blocks/v2/apply/values'

export type SavedPaletteColor = {
  id: string
  label: string
  hex: string
}

export function normalizePaletteLabel(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  return raw.trim().slice(0, 40)
}

export function normalizeSavedColor(raw: unknown): SavedPaletteColor | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const record = raw as Record<string, unknown>
  const hex = sanitizeHex(record.hex)
  if (!hex) return null
  const id = typeof record.id === 'string' && record.id.trim() ? record.id.trim() : ''
  if (!id) return null
  return {
    id,
    label: normalizePaletteLabel(record.label),
    hex,
  }
}

export function normalizeSavedColors(raw: unknown): SavedPaletteColor[] {
  if (!Array.isArray(raw)) return []
  const out: SavedPaletteColor[] = []
  const seenHex = new Set<string>()
  const seenId = new Set<string>()
  for (const item of raw) {
    const next = normalizeSavedColor(item)
    if (!next) continue
    if (seenId.has(next.id) || seenHex.has(next.hex)) continue
    seenId.add(next.id)
    seenHex.add(next.hex)
    out.push(next)
    if (out.length >= PALETTE_MAX_CUSTOM_COLORS) break
  }
  return out
}

export function paletteHasHex(colors: SavedPaletteColor[], hex: string): boolean {
  const normalized = sanitizeHex(hex)
  if (!normalized) return false
  return colors.some((color) => color.hex === normalized)
}
