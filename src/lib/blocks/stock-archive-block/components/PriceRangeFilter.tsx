'use client'

import { cn } from '@/lib/utils/cn'
import { formatPrice } from '../utils'

type Props = {
  min: number
  max: number
  priceMin: number
  priceMax: number
  histogramData: number[]
  onChange: (priceMin: number, priceMax: number) => void
  onReset: () => void
}

export function PriceRangeFilter({
  min,
  max,
  priceMin,
  priceMax,
  histogramData,
  onChange,
  onReset,
}: Props) {
  const maxCount = Math.max(...histogramData, 1)

  const handleMinChange = (value: number) => {
    onChange(Math.min(value, priceMax), priceMax)
  }

  const handleMaxChange = (value: number) => {
    onChange(priceMin, Math.max(value, priceMin))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Price</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-primary-500 hover:text-primary-600"
        >
          Reset
        </button>
      </div>

      <div className="flex h-16 items-end gap-0.5">
        {histogramData.map((count, index) => (
          <div
            key={index}
            className="flex-1 rounded-t bg-primary-200"
            style={{ height: `${Math.max(8, (count / maxCount) * 100)}%` }}
          />
        ))}
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min={min}
          max={max}
          value={priceMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="w-full accent-primary-500"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={priceMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="w-full accent-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs text-neutral-500">Min</span>
          <input
            type="number"
            min={min}
            max={priceMax}
            value={priceMin}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className={cn(
              'w-full rounded-lg border border-neutral-200 bg-light-50 px-3 py-2 text-sm',
              'focus:border-primary-500 focus:outline-none',
            )}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-neutral-500">Max</span>
          <input
            type="number"
            min={priceMin}
            max={max}
            value={priceMax}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className={cn(
              'w-full rounded-lg border border-neutral-200 bg-light-50 px-3 py-2 text-sm',
              'focus:border-primary-500 focus:outline-none',
            )}
          />
        </label>
      </div>

      <p className="text-xs text-neutral-500">
        {formatPrice(priceMin)} – {formatPrice(priceMax)}
      </p>
    </div>
  )
}
