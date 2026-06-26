'use client'

import React, { useState } from 'react'
import { FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import { SOCIAL_ICONS, SOCIAL_ICON_KEYS } from '../socialIconsData'
import { SocialIconSvg } from './SocialIconSvg'

export function SocialIconPicker(props: TextFieldClientProps) {
  const { field, path } = props
  const { label, required } = field

  const { value, setValue } = useField<string>({ path: path ?? (field as { name: string }).name })

  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? SOCIAL_ICON_KEYS.filter(
        (key) =>
          SOCIAL_ICONS[key]!.label.toLowerCase().includes(search.toLowerCase()) ||
          key.toLowerCase().includes(search.toLowerCase()),
      )
    : SOCIAL_ICON_KEYS

  return (
    <div style={{ width: '100%' }}>
      <FieldLabel label={label} path={path} required={required} />

      {value && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
            padding: '6px 10px',
            borderRadius: '4px',
            background: 'var(--theme-elevation-50)',
            border: '1px solid var(--theme-elevation-150)',
            fontSize: '13px',
          }}
        >
          <SocialIconSvg platform={value} size={20} />
          <span style={{ fontWeight: 500 }}>{SOCIAL_ICONS[value]?.label ?? value}</span>
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label="Clear selection"
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--theme-elevation-400)',
              fontSize: '16px',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Search platforms…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 10px',
          marginBottom: '8px',
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-150)',
          background: 'var(--theme-elevation-0)',
          color: 'var(--theme-text)',
          fontSize: '13px',
          boxSizing: 'border-box',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))',
          gap: '6px',
          maxHeight: '260px',
          overflowY: 'auto',
          padding: '4px',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '4px',
          background: 'var(--theme-elevation-0)',
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: '16px',
              textAlign: 'center',
              color: 'var(--theme-elevation-400)',
              fontSize: '13px',
            }}
          >
            No platforms found
          </div>
        )}
        {filtered.map((key) => {
          const icon = SOCIAL_ICONS[key]!
          const isSelected = value === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setValue(key)}
              title={icon.label}
              aria-label={`Select ${icon.label}`}
              aria-pressed={isSelected}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '8px 4px 6px',
                borderRadius: '6px',
                border: isSelected
                  ? '2px solid var(--theme-success-500, #2196f3)'
                  : '2px solid transparent',
                background: isSelected
                  ? 'var(--theme-success-50, rgba(33,150,243,0.08))'
                  : 'var(--theme-elevation-50)',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
                minWidth: 0,
              }}
            >
              <SocialIconSvg platform={key} size={28} />
              <span
                style={{
                  fontSize: '10px',
                  lineHeight: '1.2',
                  textAlign: 'center',
                  color: 'var(--theme-text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
              >
                {icon.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
