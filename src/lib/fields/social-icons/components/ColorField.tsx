'use client'

import React from 'react'
import { FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

const DEFAULT_SWATCH = '#000000'

function normalizeHex(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`
}

export function ColorField(props: TextFieldClientProps) {
  const { field, path } = props
  const { label, required, admin } = field

  const { value, setValue } = useField<string>({ path: path ?? (field as { name: string }).name })

  const hex = normalizeHex(value ?? '')
  const swatch = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex) ? hex : DEFAULT_SWATCH

  return (
    <div>
      <FieldLabel label={label} path={path} required={required} />
      {admin?.description && (
        <p
          style={{
            margin: '0 0 6px',
            fontSize: '12px',
            color: 'var(--theme-elevation-400)',
          }}
        >
          {admin.description as string}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="color"
          value={swatch}
          onChange={(e) => setValue(e.target.value)}
          aria-label={`${label} picker`}
          style={{
            width: '40px',
            height: '36px',
            padding: '2px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            cursor: 'pointer',
            background: 'var(--theme-elevation-0)',
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={(e) => setValue(normalizeHex(e.target.value))}
          placeholder="#ffffff"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '8px 10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-150)',
            background: 'var(--theme-elevation-0)',
            color: 'var(--theme-text)',
            fontSize: '13px',
          }}
        />
      </div>
    </div>
  )
}
