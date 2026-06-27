'use client'

import React from 'react'

import { cn } from '@/lib/utils/cn'
import { extractPlainTextFromRichText } from '@/lib/blocks/form-block/utils/extractPlainTextFromRichText'
import type { FormStep } from '@/lib/blocks/form-block/utils/getFormSteps'

type FormStepProgressProps = {
  steps: FormStep[]
  currentIndex: number
}

function getConnectorFillPercent(stepIndex: number, currentIndex: number): number {
  if (currentIndex > stepIndex) {
    return 100
  }
  if (currentIndex === stepIndex) {
    return 50
  }
  return 0
}

export function FormStepProgress({ steps, currentIndex }: FormStepProgressProps) {
  if (steps.length < 2) {
    return null
  }

  return (
    <nav className="mb-10 w-full" aria-label="Form progress">
      <ol className="flex w-full min-w-0 items-start overflow-x-auto pb-1 sm:overflow-visible">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isActive = isCompleted || isCurrent
          const subtitle =
            extractPlainTextFromRichText(
              step.description as Parameters<typeof extractPlainTextFromRichText>[0],
            ) ?? undefined
          const connectorFill = getConnectorFillPercent(index, currentIndex)
          const showConnector = index < steps.length - 1

          return (
            <li
              key={step.title ?? `step-${index}`}
              className={cn('flex min-w-0 items-start', showConnector ? 'flex-1' : 'shrink-0')}
            >
              <div className="flex min-w-0 flex-col items-start">
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    isActive ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-600',
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {index + 1}
                </div>
                <div className="mt-3 min-w-0 pr-2">
                  <p
                    className={cn(
                      'text-sm font-semibold leading-tight text-foreground',
                      !isActive && 'text-foreground',
                    )}
                  >
                    {step.title || `Step ${index + 1}`}
                  </p>
                  {subtitle && (
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">{subtitle}</p>
                  )}
                </div>
              </div>

              {showConnector && (
                <div
                  className="mx-2 mt-[1.125rem] h-0.5 min-w-[1.5rem] flex-1 self-start rounded-full bg-neutral-200"
                  aria-hidden
                >
                  <div
                    className="h-full rounded-full bg-primary-500 transition-[width] duration-300 ease-out"
                    style={{ width: `${connectorFill}%` }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
