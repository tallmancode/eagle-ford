'use client'

import type { Control, FieldErrors, FieldValues } from 'react-hook-form'

import { SelectField } from '@/lib/blocks/form-block/components/fields/SelectField'
import { stateOptions } from '@/lib/blocks/form-block/components/fields/stateOptions'

type StateFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  errors: Partial<FieldErrors<FieldValues>>
  control: Control<FieldValues>
}

export function StateField(props: StateFieldProps) {
  return <SelectField {...props} placeholder="Select a state" options={stateOptions} />
}
