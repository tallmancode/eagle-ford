'use client'

import { X } from 'lucide-react'
import type { MotorCityStockFilterOptions } from '@/lib/motor-city-stock/types'
import {
  buildPriceHistogram,
  getMileageBounds,
  getPriceBoundsFromRange,
  getUniqueModels,
  type StockArchiveVehicle,
} from '../utils'
import { PriceRangeFilter } from './PriceRangeFilter'

type Props = {
  vehicles: StockArchiveVehicle[]
  filterOptions: MotorCityStockFilterOptions
  selectedModel?: string
  selectedFuelType?: string
  selectedTransmission?: string
  priceMin?: number
  priceMax?: number
  mileageMax?: number
  onModelChange: (model: string | undefined) => void
  onFuelTypeChange: (fuelType: string | undefined) => void
  onTransmissionChange: (transmission: string | undefined) => void
  onPriceChange: (priceMin: number | undefined, priceMax: number | undefined) => void
  onMileageChange: (mileageMax: number | undefined) => void
}

function SelectedFilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-neutral-200 bg-light-50 p-3">
      <p className="text-sm font-semibold text-neutral-900">{label}</p>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        aria-label="Remove filter"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

export function StockArchiveFilters({
  vehicles,
  filterOptions,
  selectedModel,
  selectedFuelType,
  selectedTransmission,
  priceMin,
  priceMax,
  mileageMax,
  onModelChange,
  onFuelTypeChange,
  onTransmissionChange,
  onPriceChange,
  onMileageChange,
}: Props) {
  const priceBounds = getPriceBoundsFromRange(filterOptions.priceRange, vehicles)
  const mileageBounds = getMileageBounds(vehicles)
  const histogram = buildPriceHistogram(vehicles, priceBounds)
  const models = getUniqueModels(vehicles)

  const visibleFuelTypes = filterOptions.fuelTypes.filter((option) => option.count > 0)
  const visibleTransmissions = filterOptions.transmissions.filter((option) => option.count > 0)

  const currentPriceMin = priceMin ?? priceBounds.min
  const currentPriceMax = priceMax ?? priceBounds.max
  const currentMileageMax = mileageMax ?? mileageBounds.max

  return (
    <aside className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Model</h3>
          <button
            type="button"
            onClick={() => onModelChange(undefined)}
            className="text-xs font-medium text-primary-500 hover:text-primary-600"
          >
            Reset
          </button>
        </div>

        {selectedModel && (
          <SelectedFilterChip label={selectedModel} onRemove={() => onModelChange(undefined)} />
        )}

        <select
          value={selectedModel ?? ''}
          onChange={(e) => onModelChange(e.target.value || undefined)}
          className="w-full rounded-lg border border-neutral-200 bg-light-50 px-3 py-2 text-sm"
        >
          <option value="">All models</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Fuel type</h3>
          <button
            type="button"
            onClick={() => onFuelTypeChange(undefined)}
            className="text-xs font-medium text-primary-500 hover:text-primary-600"
          >
            Reset
          </button>
        </div>

        <select
          value={selectedFuelType ?? ''}
          onChange={(e) => onFuelTypeChange(e.target.value || undefined)}
          className="w-full rounded-lg border border-neutral-200 bg-light-50 px-3 py-2 text-sm"
        >
          <option value="">All fuel types</option>
          {visibleFuelTypes.map((option) => (
            <option key={option.label} value={option.label}>
              {option.name} ({option.count})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Transmission</h3>
          <button
            type="button"
            onClick={() => onTransmissionChange(undefined)}
            className="text-xs font-medium text-primary-500 hover:text-primary-600"
          >
            Reset
          </button>
        </div>

        <select
          value={selectedTransmission ?? ''}
          onChange={(e) => onTransmissionChange(e.target.value || undefined)}
          className="w-full rounded-lg border border-neutral-200 bg-light-50 px-3 py-2 text-sm"
        >
          <option value="">All transmissions</option>
          {visibleTransmissions.map((option) => (
            <option key={option.label} value={option.label}>
              {option.name} ({option.count})
            </option>
          ))}
        </select>
      </div>

      <PriceRangeFilter
        min={priceBounds.min}
        max={priceBounds.max}
        priceMin={currentPriceMin}
        priceMax={currentPriceMax}
        histogramData={histogram}
        onChange={(min, max) => onPriceChange(min, max)}
        onReset={() => onPriceChange(undefined, undefined)}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Mileage</h3>
          <button
            type="button"
            onClick={() => onMileageChange(undefined)}
            className="text-xs font-medium text-primary-500 hover:text-primary-600"
          >
            Reset
          </button>
        </div>

        <input
          type="range"
          min={mileageBounds.min}
          max={mileageBounds.max}
          value={currentMileageMax}
          onChange={(e) => onMileageChange(Number(e.target.value))}
          className="w-full accent-primary-500"
        />

        <p className="text-xs text-neutral-500">
          Up to {new Intl.NumberFormat('en-ZA').format(currentMileageMax)} km
        </p>
      </div>
    </aside>
  )
}
