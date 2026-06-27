'use client'

import type { Control, FieldErrors, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { FieldError } from '@/lib/blocks/form-block/components/fields/FieldError'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'
import { DatePicker } from '@/lib/components/ui/date-picker'
import { Label } from '@/lib/components/ui/label'

type DateFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  errors: Partial<FieldErrors<FieldValues>>
  control: Control<FieldValues>
}

export function DateField({ name, label, width, required, errors, control }: DateFieldProps) {
  const error = errors[name]

  return (
    <FieldWrapper width={width}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required ? ' *' : ''}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? `${label || name} is required` : false,
        }}
        render={({ field }) => (
          <DatePicker
            id={name}
            value={typeof field.value === 'string' ? field.value : ''}
            onChange={field.onChange}
            placeholder={label ? `Select ${label.toLowerCase()}` : 'Pick a date'}
            aria-invalid={Boolean(error)}
          />
        )}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
