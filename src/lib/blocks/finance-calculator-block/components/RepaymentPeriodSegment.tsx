import { REPAYMENT_PERIOD_OPTIONS } from '@/lib/blocks/finance-calculator-block/financeCalculatorOptions'
import { cn } from '@/lib/utils/cn'

type RepaymentPeriodSegmentProps = {
  value: number
  onChange: (value: number) => void
}

export function RepaymentPeriodSegment({ value, onChange }: RepaymentPeriodSegmentProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-neutral-900">Repayment period (months)</p>
      <div
        className="flex overflow-hidden rounded-xl border border-neutral-200"
        role="group"
        aria-label="Repayment period in months"
      >
        {REPAYMENT_PERIOD_OPTIONS.map((months, index) => {
          const isSelected = value === months

          return (
            <button
              key={months}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(months)}
              className={cn(
                'h-12 flex-1 border-neutral-200 text-sm font-medium transition-colors',
                index > 0 && 'border-l',
                isSelected
                  ? 'bg-neutral-900 text-white ring-2 ring-inset ring-primary-500'
                  : 'bg-white text-neutral-900 hover:bg-neutral-50',
              )}
            >
              {months}
            </button>
          )
        })}
      </div>
    </div>
  )
}
