'use client'

import React from 'react'
import { useRowLabel } from '@payloadcms/ui'

type FormFieldRowData = {
  label?: string | Record<string, string> | null
  name?: string | null
  blockType?: string
  blockName?: string | null
}

const blockTypeLabels: Record<string, string> = {
  checkbox: 'Checkbox',
  country: 'Country',
  date: 'Date',
  email: 'Email',
  message: 'Message',
  subheading: 'Subheading',
  number: 'Number',
  radio: 'Radio',
  select: 'Select',
  state: 'State',
  upload: 'Upload',
  text: 'Text',
  textarea: 'Text Area',
}

function getFieldLabel(value: FormFieldRowData['label']): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || undefined
  }

  if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) {
      if (typeof entry === 'string') {
        const trimmed = entry.trim()
        if (trimmed) {
          return trimmed
        }
      }
    }
  }

  return undefined
}

/** Block row header for form builder fields (registered as `admin.components.Label`). */
export function FormFieldRowLabel() {
  const { data, rowNumber } = useRowLabel<FormFieldRowData>()

  const label = getFieldLabel(data?.label)
  if (label) {
    return <span>{label}</span>
  }

  const blockName = data?.blockName?.trim()
  if (blockName) {
    return <span>{blockName}</span>
  }

  const name = data?.name?.trim()
  if (name) {
    return <span>{name}</span>
  }

  const blockType = data?.blockType
  if (blockType) {
    const typeLabel = blockTypeLabels[blockType] ?? blockType
    return <span>{typeLabel}</span>
  }

  return <span>{`Field ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
