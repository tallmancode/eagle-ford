'use client'

import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { TextInput, useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

function slugifyLabel(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Custom Field component for the `name` field inside form builder blocks.
 * Auto-populates from the sibling `label` field as the user types.
 * Once the user manually edits `name`, auto-population stops.
 */
export function FormFieldNameInput(props: TextFieldClientProps) {
  const {
    field: { admin: { placeholder, className } = {}, label, required },
    path: pathFromProps,
    readOnly,
  } = props

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    path,
    setValue,
    showError,
    value,
  } = useField<string>({ potentiallyStalePath: pathFromProps })

  // Derive the sibling label field path: 'fields.0.name' → 'fields.0.label'
  const labelPath = useMemo(
    () => (pathFromProps ?? '').replace(/\.name$/, '.label'),
    [pathFromProps],
  )

  const labelValue = useFormFields(([fields]) => {
    const f = fields[labelPath]
    return typeof f?.value === 'string' ? f.value : ''
  })

  // Tracks the last value we auto-generated.
  // '\0' is a sentinel meaning "user has manually edited — never auto-populate".
  // Initialised to '\0' when value is non-empty on mount so existing saved
  // values are never overwritten.
  const lastAutoRef = useRef(value ? '\0' : '')

  useEffect(() => {
    // If name differs from what we last auto-generated, the user has manually
    // edited it — stop auto-populating.
    if (value !== '' && value !== lastAutoRef.current) return

    if (!labelValue) return

    const generated = slugifyLabel(labelValue)
    lastAutoRef.current = generated

    if (generated !== value) {
      setValue(generated)
    }
  }, [labelValue, setValue, value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // User is manually editing — lock out auto-population permanently.
      lastAutoRef.current = '\0'
      setValue(e.target.value)
    },
    [setValue],
  )

  return (
    <TextInput
      AfterInput={AfterInput}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      Error={Error}
      Label={Label}
      label={label}
      onChange={handleChange}
      path={path || pathFromProps || ''}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      showError={showError}
      value={value ?? ''}
    />
  )
}
