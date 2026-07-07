'use client'

import * as React from 'react'
import { format, isValid, parseISO } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { formControlClassName } from '@/lib/components/ui/form-control-classes'
import { Button } from '@/lib/components/ui/button'
import { Calendar } from '@/lib/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/ui/popover'
import { cn } from '@/lib/utils/cn'

type DatePickerProps = {
  id?: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  'aria-invalid'?: boolean
  className?: string
}

function DatePicker({
  id,
  value,
  onChange,
  placeholder = 'Pick a date',
  'aria-invalid': ariaInvalid,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => {
    if (!value) {
      return undefined
    }

    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : undefined
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={ariaInvalid}
          className={cn(
            formControlClassName,
            'w-full justify-start gap-2 text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="size-4 shrink-0" />
          {selectedDate ? format(selectedDate, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-light-50" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onChange(date ? format(date, 'yyyy-MM-dd') : '')
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
