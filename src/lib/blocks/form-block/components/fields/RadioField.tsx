'use client'

import type { Control, FieldErrors, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { cn } from '@/lib/utils/cn'
import { Label } from '@/lib/components/ui/label'
import { FieldError } from '@/lib/blocks/form-block/components/fields/FieldError'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'

type RadioOption = {
  label: string
  value: string
}

type RadioFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  defaultValue?: string | null
  options?: RadioOption[] | null
  errors: Partial<FieldErrors<FieldValues>>
  control: Control<FieldValues>
}

export function RadioField({
  name,
  label,
  width,
  required,
  defaultValue,
  options,
  errors,
  control,
}: RadioFieldProps) {
  const error = errors[name]
  const isFullWidth = !width || width >= 100

  return (
    <FieldWrapper width={isFullWidth ? 100 : width}>
      {label && (
        <Label className="font-semibold text-neutral-800">
          {label}
          {required ? ' *' : ''}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ''}
        rules={{
          required: required ? `${label || name} is required` : false,
        }}
        render={({ field }) => (
          <div
            className="flex flex-wrap gap-x-6 gap-y-2"
            role="radiogroup"
            aria-invalid={Boolean(error)}
            aria-labelledby={label ? `${name}-label` : undefined}
          >
            {options?.map((option) => {
              const optionId = `${name}-${option.value}`
              return (
                <div key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={optionId}
                    name={name}
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className={cn(
                      'size-4 shrink-0 cursor-pointer border-neutral-300 text-primary-500',
                      'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                    )}
                  />
                  <Label htmlFor={optionId} className="cursor-pointer font-normal text-neutral-600">
                    {option.label}
                  </Label>
                </div>
              )
            })}
          </div>
        )}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
