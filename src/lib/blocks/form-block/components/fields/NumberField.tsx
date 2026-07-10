'use client'

import type { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/lib/components/ui/input'
import { Label } from '@/lib/components/ui/label'
import { FieldError } from '@/lib/blocks/form-block/components/fields/FieldError'
import { formControlClassName } from '@/lib/components/ui/form-control-classes'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'

type NumberFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  min?: number | null
  max?: number | null
  errors: Partial<FieldErrors<FieldValues>>
  register: UseFormRegister<FieldValues>
}

export function NumberField({
  name,
  label,
  width,
  required,
  min,
  max,
  errors,
  register,
}: NumberFieldProps) {
  const error = errors[name]

  return (
    <FieldWrapper width={width}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required ? ' *' : ''}
        </Label>
      )}
      <Input
        id={name}
        type="number"
        className={formControlClassName}
        aria-invalid={Boolean(error)}
        min={min ?? undefined}
        max={max ?? undefined}
        {...register(name, {
          required: required ? `${label || name} is required` : false,
          valueAsNumber: false,
          validate: (value) => {
            if (value === '' || value === undefined || value === null) {
              return true
            }

            const num = Number(value)

            if (Number.isNaN(num)) {
              return `${label || name} must be a number`
            }

            if (min != null && num < min) {
              return `${label || name} must be at least ${min.toLocaleString()}`
            }

            if (max != null && num > max) {
              return `${label || name} must be at most ${max.toLocaleString()}`
            }

            return true
          },
        })}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
