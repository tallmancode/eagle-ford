'use client'

import type { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

import { cn } from '@/lib/utils/cn'
import { Label } from '@/lib/components/ui/label'
import { Textarea } from '@/lib/components/ui/textarea'
import { FieldError } from '@/lib/blocks/form-block/components/fields/FieldError'
import { formControlClassName } from '@/lib/components/ui/form-control-classes'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'

type TextareaFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  errors: Partial<FieldErrors<FieldValues>>
  register: UseFormRegister<FieldValues>
}

export function TextareaField({
  name,
  label,
  width,
  required,
  errors,
  register,
}: TextareaFieldProps) {
  const error = errors[name]

  return (
    <FieldWrapper width={width}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required ? ' *' : ''}
        </Label>
      )}
      <Textarea
        id={name}
        rows={4}
        className={cn(formControlClassName, 'min-h-24 h-auto py-2.5')}
        aria-invalid={Boolean(error)}
        {...register(name, {
          required: required ? `${label || name} is required` : false,
        })}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
