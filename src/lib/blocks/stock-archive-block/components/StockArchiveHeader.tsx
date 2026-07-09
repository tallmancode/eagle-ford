'use client'

import { cn } from '@/lib/utils/cn'
import type { TaxonomyFilterOption } from '@/lib/motor-city-stock/types'

type Props = {
  heading: string
  count: number
  bodyTypes: TaxonomyFilterOption[]
  selectedBodyType?: string
  onBodyTypeChange: (bodyType: string | undefined) => void
}

export function StockArchiveHeader({
  heading,
  count,
  bodyTypes,
  selectedBodyType,
  onBodyTypeChange,
}: Props) {
  const visibleBodyTypes = bodyTypes.filter((option) => option.count > 0)

  return (
    <div className="mb-8">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">{heading}</h2>
        <span className="rounded-full bg-primary-500 px-4 py-1 text-sm font-semibold text-light-50">
          {count}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onBodyTypeChange(undefined)}
          className={cn(
            'rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
            !selectedBodyType
              ? 'border-neutral-900 bg-light-50 text-neutral-900'
              : 'border-neutral-200 bg-light-50 text-neutral-600 hover:border-neutral-400',
          )}
        >
          All types
        </button>
        {visibleBodyTypes.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onBodyTypeChange(option.label)}
            className={cn(
              'rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
              selectedBodyType === option.label
                ? 'border-neutral-900 bg-light-50 text-neutral-900'
                : 'border-neutral-200 bg-light-50 text-neutral-600 hover:border-neutral-400',
            )}
          >
            {option.name}
            <span className="ml-1 text-neutral-400">({option.count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
