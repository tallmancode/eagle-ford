'use client'

import { ImageIcon, Plus, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import type { Control, FieldErrors, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Button } from '@/lib/components/ui/button'
import { Label } from '@/lib/components/ui/label'
import { FieldError } from '@/lib/blocks/form-block/components/fields/FieldError'
import { FieldWrapper } from '@/lib/blocks/form-block/components/fields/FieldWrapper'
import {
  buildUploadHelperText,
  fileMatchesMimePatterns,
  mimePatternsToAccept,
  normalizeUploadValue,
} from '@/lib/blocks/form-block/utils/uploadFieldUtils'
import { cn } from '@/lib/utils/cn'

type UploadFieldProps = {
  name: string
  label?: string | null
  width?: number | null
  required?: boolean | null
  multiple?: boolean | null
  maxFileSize?: number | null
  mimeTypes?: { mimeType: string }[] | null
  errors: Partial<FieldErrors<FieldValues>>
  control: Control<FieldValues>
}

function validateUploadFiles(
  files: File[],
  options: {
    required?: boolean | null
    multiple?: boolean | null
    maxFileSize?: number | null
    mimeTypes?: { mimeType: string }[] | null
    label?: string | null
    name: string
  },
): string | true {
  const fieldLabel = options.label || options.name

  if (files.length === 0) {
    return options.required ? `${fieldLabel} is required` : true
  }

  if (!options.multiple && files.length > 1) {
    return `${fieldLabel} does not allow multiple files`
  }

  for (const file of files) {
    if (options.mimeTypes?.length && !fileMatchesMimePatterns(file, options.mimeTypes)) {
      return `${fieldLabel}: File type "${file.type}" is not allowed`
    }

    if (options.maxFileSize && options.maxFileSize > 0 && file.size > options.maxFileSize) {
      const maxSizeMB = (options.maxFileSize / (1024 * 1024)).toFixed(2)
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      return `${fieldLabel}: File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`
    }
  }

  return true
}

export function UploadField({
  name,
  label,
  required,
  multiple,
  maxFileSize,
  mimeTypes,
  errors,
  control,
}: UploadFieldProps) {
  const error = errors[name]
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const accept = mimePatternsToAccept(mimeTypes)
  const helperText = buildUploadHelperText(mimeTypes, maxFileSize)

  const applyFiles = useCallback((current: File[], incoming: File[], allowMultiple: boolean) => {
    if (allowMultiple) {
      return [...current, ...incoming]
    }
    return incoming.length > 0 ? [incoming[0]!] : current
  }, [])

  return (
    <FieldWrapper width={100}>
      {label && (
        <Label className="font-semibold text-neutral-800">
          {label}
          {required ? ' *' : ''}
        </Label>
      )}
      <Controller
        control={control}
        name={name}
        rules={{
          validate: (value) =>
            validateUploadFiles(normalizeUploadValue(value), {
              required,
              multiple,
              maxFileSize,
              mimeTypes,
              label,
              name,
            }),
        }}
        render={({ field }) => {
          const files = normalizeUploadValue(field.value)

          const setFiles = (next: File[]) => {
            if (multiple) {
              field.onChange(next.length > 0 ? next : null)
            } else {
              field.onChange(next[0] ?? null)
            }
          }

          const addFiles = (incoming: FileList | File[]) => {
            const list = Array.from(incoming)
            setFiles(applyFiles(files, list, Boolean(multiple)))
          }

          const removeFile = (index: number) => {
            setFiles(files.filter((_, i) => i !== index))
          }

          return (
            <div className="flex flex-col gap-3">
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed px-6 py-10 transition-colors',
                  isDragging
                    ? 'border-primary-500 bg-primary-50/50'
                    : 'border-neutral-300 bg-neutral-50/50',
                  error && 'border-destructive',
                )}
                onDragEnter={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                  if (e.dataTransfer.files.length > 0) {
                    addFiles(e.dataTransfer.files)
                  }
                }}
              >
                <ImageIcon className="size-10 text-neutral-300" strokeWidth={1.25} aria-hidden />
                <p className="max-w-md text-center text-sm text-neutral-400">{helperText}</p>
                <Button
                  type="button"
                  className="h-11 gap-2 bg-primary-500 px-5 font-semibold text-white hover:bg-primary-600"
                  onClick={() => inputRef.current?.click()}
                >
                  <Plus className="size-4" aria-hidden />
                  Select Images
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  multiple={Boolean(multiple)}
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      addFiles(e.target.files)
                    }
                    e.target.value = ''
                  }}
                />
              </div>

              {files.length > 0 && (
                <ul className="flex flex-col gap-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
                    >
                      <span className="truncate text-neutral-700">{file.name}</span>
                      <button
                        type="button"
                        className="shrink-0 text-neutral-400 hover:text-neutral-700"
                        aria-label={`Remove ${file.name}`}
                        onClick={() => removeFile(index)}
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        }}
      />
      <FieldError message={error?.message as string | undefined} />
    </FieldWrapper>
  )
}
