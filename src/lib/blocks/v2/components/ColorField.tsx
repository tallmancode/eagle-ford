'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Pipette } from 'lucide-react'
import { toast, useAuth, useField } from '@payloadcms/ui'
import type { JSONFieldClientProps } from 'payload'
import { COLOR_TOKENS, PALETTE_MAX_CUSTOM_COLORS } from '@/lib/blocks/v2/theme'
import { emptyColorValue, mergeColorValue, sanitizeHex } from '@/lib/blocks/v2/apply/values'
import { paletteHasHex, type SavedPaletteColor } from '@/lib/blocks/v2/palette'
import type { ColorTokenKey, ColorValue } from '@/lib/blocks/v2/types'
import { FieldShell } from '@/lib/blocks/v2/components/ui/FieldShell'
import styles from '@/lib/blocks/v2/components/ui/color-field.module.css'

export type ColorFieldClientProps = JSONFieldClientProps & {
  defaultToken?: ColorTokenKey | ''
  allowInherit?: boolean
}

type EyeDropperCtor = new () => { open: () => Promise<{ sRGBHex: string }> }

function fieldLabel(field: JSONFieldClientProps['field'], fallback: string): string {
  return typeof field?.label === 'string' ? field.label : fallback
}

function fieldDescription(field: JSONFieldClientProps['field']): string | undefined {
  if (field?.admin && typeof field.admin === 'object' && 'description' in field.admin) {
    return field.admin.description as string | undefined
  }
  return undefined
}

function swatchStyle(color: string): CSSProperties {
  return { ['--swatch-color' as string]: color } as CSSProperties
}

export function ColorField({
  path,
  field,
  defaultToken = '',
  allowInherit = false,
}: ColorFieldClientProps) {
  const { value, setValue } = useField<ColorValue | string | null | undefined>({ path })
  const { user } = useAuth()
  const merged = useMemo(() => mergeColorValue(value, defaultToken), [defaultToken, value])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [hexDraft, setHexDraft] = useState(merged.source === 'custom' ? merged.hex : '#000000')
  const [saveLabel, setSaveLabel] = useState('')
  const [savedColors, setSavedColors] = useState<SavedPaletteColor[]>([])
  const [saving, setSaving] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  const canSavePalette = Boolean(
    user &&
      typeof user === 'object' &&
      'roles' in user &&
      Array.isArray((user as { roles?: string[] }).roles) &&
      ((user as { roles?: string[] }).roles?.includes('admin') ||
        (user as { roles?: string[] }).roles?.includes('developer')),
  )

  const supportsEyedropper =
    typeof window !== 'undefined' && 'EyeDropper' in window

  const loadPalette = useCallback(async () => {
    try {
      const response = await fetch('/next/v2-palette', { credentials: 'include' })
      const json = (await response.json().catch(() => null)) as
        | { customColors?: SavedPaletteColor[] }
        | null
      if (response.ok && json && Array.isArray(json.customColors)) {
        setSavedColors(json.customColors)
      }
    } catch {
      // Palette is optional; the picker still works with tokens + one-off hex.
    }
  }, [])

  useEffect(() => {
    void loadPalette()
  }, [loadPalette])

  useEffect(() => {
    if (merged.source === 'custom' && merged.hex) setHexDraft(merged.hex)
  }, [merged])

  useEffect(() => {
    if (!pickerOpen) return
    function onPointerDown(event: MouseEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) setPickerOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [pickerOpen])

  const commit = useCallback(
    (next: ColorValue) => {
      setValue(next)
    },
    [setValue],
  )

  const pickToken = useCallback(
    (token: ColorTokenKey) => {
      setPickerOpen(false)
      commit({ source: 'token', token, hex: '' })
    },
    [commit],
  )

  const pickInherit = useCallback(() => {
    setPickerOpen(false)
    commit(emptyColorValue(''))
  }, [commit])

  const pickHex = useCallback(
    (raw: string) => {
      const hex = sanitizeHex(raw)
      if (!hex) return
      setHexDraft(hex)
      commit({ source: 'custom', token: '', hex })
    },
    [commit],
  )

  const onEyedropper = useCallback(async () => {
    const Ctor = (window as unknown as { EyeDropper?: EyeDropperCtor }).EyeDropper
    if (!Ctor) return
    try {
      const result = await new Ctor().open()
      pickHex(result.sRGBHex)
    } catch {
      // User cancelled the eyedropper.
    }
  }, [pickHex])

  const alreadySaved = merged.source === 'custom' && paletteHasHex(savedColors, merged.hex)
  const atCap = savedColors.length >= PALETTE_MAX_CUSTOM_COLORS

  const onSaveToPalette = useCallback(async () => {
    if (merged.source !== 'custom' || !merged.hex || alreadySaved || atCap) return
    setSaving(true)
    try {
      const response = await fetch('/next/v2-palette', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hex: merged.hex, label: saveLabel }),
      })
      const json = (await response.json().catch(() => null)) as
        | { customColors?: SavedPaletteColor[]; message?: string }
        | null
      if (!response.ok) {
        toast.error(json?.message || 'Could not save color to the site palette')
        return
      }
      if (json && Array.isArray(json.customColors)) setSavedColors(json.customColors)
      setSaveLabel('')
      toast.success('Saved to site palette')
    } catch {
      toast.error('Could not save color to the site palette')
    } finally {
      setSaving(false)
    }
  }, [alreadySaved, atCap, merged, saveLabel])

  const label = fieldLabel(field, 'Color')
  const description = fieldDescription(field)
  const inheritActive = merged.source === ''
  const customActive = merged.source === 'custom'

  return (
    <FieldShell label={label} description={description}>
      <div className={styles.field} ref={pickerRef}>
        <div className={styles.row} role="listbox" aria-label={`${label} tokens`}>
          {allowInherit ? (
            <button
              type="button"
              className={`${styles.swatch} ${styles.swatchInherit} ${inheritActive ? styles.swatchActive : ''}`}
              aria-label="Inherit"
              title="Inherit"
              aria-selected={inheritActive}
              onClick={pickInherit}
            />
          ) : null}
          {COLOR_TOKENS.map((token) => {
            const active = merged.source === 'token' && merged.token === token.key
            return (
              <button
                key={token.key}
                type="button"
                className={`${styles.swatch} ${active ? styles.swatchActive : ''}`}
                style={swatchStyle(token.fallback)}
                aria-label={token.label}
                title={token.label}
                aria-selected={active}
                onClick={() => pickToken(token.key)}
              />
            )
          })}
          <button
            type="button"
            className={`${styles.customBtn} ${customActive || pickerOpen ? styles.customBtnActive : ''}`}
            aria-expanded={pickerOpen}
            aria-controls={`${path}-custom-picker`}
            onClick={() => setPickerOpen((open) => !open)}
          >
            Custom
          </button>
        </div>

        {pickerOpen ? (
          <div
            className={styles.popover}
            id={`${path}-custom-picker`}
            role="dialog"
            aria-label="Custom color"
          >
            <div className={styles.popoverRow}>
              <input
                className={styles.nativeColor}
                type="color"
                value={sanitizeHex(hexDraft) || '#000000'}
                onChange={(event) => pickHex(event.target.value)}
                aria-label="Color picker"
              />
              <input
                className={styles.hexInput}
                value={hexDraft}
                onChange={(event) => {
                  setHexDraft(event.target.value)
                  pickHex(event.target.value)
                }}
                spellCheck={false}
                aria-label="Hex color"
              />
              {supportsEyedropper ? (
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => void onEyedropper()}
                  aria-label="Pick color from screen"
                  title="Pick from screen"
                >
                  <Pipette size={14} />
                </button>
              ) : null}
            </div>
            {canSavePalette && customActive && merged.hex ? (
              <div className={styles.saveRow}>
                <input
                  className={styles.labelInput}
                  value={saveLabel}
                  onChange={(event) => setSaveLabel(event.target.value)}
                  placeholder="Optional name"
                  aria-label="Saved color name"
                  maxLength={40}
                />
                <button
                  type="button"
                  className={styles.saveBtn}
                  disabled={saving || alreadySaved || atCap}
                  onClick={() => void onSaveToPalette()}
                >
                  {alreadySaved
                    ? 'Already in palette'
                    : atCap
                      ? 'Palette full'
                      : saving
                        ? 'Saving…'
                        : 'Save to site palette'}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {savedColors.length > 0 ? (
          <div className={styles.row} role="listbox" aria-label="Saved site colors">
            <p className={styles.rowLabel}>Saved</p>
            {savedColors.map((color) => {
              const active = merged.source === 'custom' && merged.hex === color.hex
              return (
                <button
                  key={color.id}
                  type="button"
                  className={`${styles.swatch} ${active ? styles.swatchActive : ''}`}
                  style={swatchStyle(color.hex)}
                  aria-label={color.label || color.hex}
                  title={color.label || color.hex}
                  aria-selected={active}
                  onClick={() => pickHex(color.hex)}
                />
              )
            })}
          </div>
        ) : null}
      </div>
    </FieldShell>
  )
}
