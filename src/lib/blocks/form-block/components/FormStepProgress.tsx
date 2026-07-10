'use client'

import React from 'react'

import { Button } from '@/lib/components/ui/button'
import { cn } from '@/lib/utils/cn'
import type { FormStep } from '@/lib/blocks/form-block/utils/getFormSteps'

type FormStepProgressProps = {
  steps: FormStep[]
  currentIndex: number
  backLabel?: string
  isLoading?: boolean
  onBack?: () => void
  showBackButton?: boolean
}

export function FormStepProgress({
  steps,
  currentIndex,
  backLabel = 'Back',
  isLoading = false,
  onBack,
  showBackButton = false,
}: FormStepProgressProps) {
  if (steps.length < 2) {
    return null
  }

  return (
    <div
      className="my-4 flex flex-wrap items-center justify-between gap-3"
      aria-label="Form progress"
    >
      <div className="flex flex-wrap items-center gap-3">
        {showBackButton && onBack && (
          <Button
            type="button"
            variant="secondary"
            disabled={isLoading}
            onClick={onBack}
            className="rounded-full"
          >
            {backLabel}
          </Button>
        )}
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Step {currentIndex + 1} of {steps.length}
        </p>
      </div>
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
