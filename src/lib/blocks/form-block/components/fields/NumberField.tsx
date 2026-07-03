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
  errors: Partial<FieldErrors<FieldValues>>
  register: UseFormRegister<FieldValues>
}

export function NumberField({ name, label, width, required, errors, register }: NumberFieldProps) {
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
        {...register(name, {
          required: required ? `${label || name} is required` : false,
          valueAsNumber: false,
        })}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
