'use client'

import React from 'react'

import { cn } from '@/lib/utils/cn'
import type { FormStep } from '@/lib/blocks/form-block/utils/getFormSteps'

type FormStepProgressProps = {
  steps: FormStep[]
  currentIndex: number
}

export function FormStepProgress({ steps, currentIndex }: FormStepProgressProps) {
  if (steps.length < 2) {
    return null
  }

  return (
    <div className="my-4 flex items-center justify-between" aria-label="Form progress">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Step {currentIndex + 1} of {steps.length}
      </p>
      <div className="flex gap-1.5">
        {steps.map((step, index) => (
          <span
            key={step.title ?? `step-${index}`}
            className={cn(
              'h-1.5 w-8 rounded-full',
              index <= currentIndex ? 'bg-primary' : 'bg-muted',
            )}
          />
        ))}
      </div>
    </div>
  )
}
