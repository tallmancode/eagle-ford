'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { TextInput, useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

import { altFromFilename } from '@/lib/utils/altFromFilename'

/**
 * Custom Field component for the Media collection `alt` field.
 * Auto-populates from the uploaded file's `filename` when a file is loaded.
 * Once the user manually edits `alt`, auto-population stops.
 */
export function MediaAltField(props: TextFieldClientProps) {
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

  const filenameValue = useFormFields(([fields]) => {
    const f = fields.filename
    return typeof f?.value === 'string' ? f.value : ''
  })

  // Tracks the last value we auto-generated.
  // '\0' is a sentinel meaning "user has manually edited — never auto-populate".
  // Initialised to '\0' when value is non-empty on mount so existing saved
  // values are never overwritten.
  const lastAutoRef = useRef(value ? '\0' : '')

  useEffect(() => {
    // If alt differs from what we last auto-generated, the user has manually
    // edited it — stop auto-populating.
    if (value !== '' && value !== lastAutoRef.current) return

    if (!filenameValue) return

    const generated = altFromFilename(filenameValue)
    lastAutoRef.current = generated

    if (generated !== value) {
      setValue(generated)
    }
  }, [filenameValue, setValue, value])

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
