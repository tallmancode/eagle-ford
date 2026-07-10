'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { MotorCityStockFilterOptions } from '@/lib/motor-city-stock/types'
import { cn } from '@/lib/utils/cn'
import {
  countActiveFilters,
  getShowingRange,
  type StockArchiveFilters,
  type StockArchiveVehicle,
} from '../utils'
import { StockArchiveFilters as StockArchiveFiltersPanel } from './StockArchiveFilters'

const EMPTY_FILTERS: StockArchiveFilters = {}

type Props = {
  vehicles: StockArchiveVehicle[]
  filterOptions: MotorCityStockFilterOptions
  activeFilters: StockArchiveFilters
  currentPage: number
  totalPages: number
  totalDocs: number
  limit: number
  showPagination: boolean
  onPageChange: (page: number) => void
  onApplyFilters: (filters: StockArchiveFilters) => void
}

export function StockArchiveToolbar({
  vehicles,
  filterOptions,
  activeFilters,
  currentPage,
  totalPages,
  totalDocs,
  limit,
  showPagination,
  onPageChange,
  onApplyFilters,
}: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState<StockArchiveFilters>(activeFilters)
  const activeFilterCount = countActiveFilters(activeFilters)
  const { start, end, total } = getShowingRange(currentPage, limit, totalDocs)

  const updateDraftFilters = (updates: Partial<StockArchiveFilters>) => {
    setDraftFilters((prev) => ({ ...prev, ...updates }))
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDraftFilters(activeFilters)
    }
    setFiltersOpen(open)
  }

  const handleClear = () => {
    setDraftFilters(EMPTY_FILTERS)
    onApplyFilters(EMPTY_FILTERS)
  }

  const handleApply = () => {
    onApplyFilters(draftFilters)
    setFiltersOpen(false)
  }

  return (
    <>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-neutral-200 bg-light-50 px-4 py-3 text-sm font-semibold text-neutral-900"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersHorizontal className="size-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-primary-500 px-2 py-0.5 text-xs font-semibold text-light-50">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2">
            {showPagination && totalPages > 1 && (
              <Pagination>
                <PaginationContent className="flex-wrap justify-center">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage > 1) onPageChange(currentPage - 1)
                      }}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage < totalPages) onPageChange(currentPage + 1)
                      }}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            <p className="text-sm text-neutral-500">
              {total === 0 ? 'No vehicles found' : `Showing ${start}–${end} of ${total}`}
            </p>
          </div>

          <div className="hidden flex-1 lg:block" aria-hidden="true" />
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="left" className={cn('flex w-full flex-col sm:max-w-md z-80')}>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-4 px-2">
            <StockArchiveFiltersPanel
              vehicles={vehicles}
              filterOptions={filterOptions}
              selectedModel={draftFilters.model}
              selectedBodyType={draftFilters.bodyType}
              selectedFuelType={draftFilters.fuelType}
              selectedTransmission={draftFilters.transmission}
              priceMin={draftFilters.priceMin}
              priceMax={draftFilters.priceMax}
              mileageMax={draftFilters.mileageMax}
              onModelChange={(model) => updateDraftFilters({ model })}
              onBodyTypeChange={(bodyType) => updateDraftFilters({ bodyType })}
              onFuelTypeChange={(fuelType) => updateDraftFilters({ fuelType })}
              onTransmissionChange={(transmission) => updateDraftFilters({ transmission })}
              onPriceChange={(priceMin, priceMax) => updateDraftFilters({ priceMin, priceMax })}
              onMileageChange={(mileageMax) => updateDraftFilters({ mileageMax })}
            />
          </div>

          <SheetFooter className="flex-row gap-3 sm:flex-row sm:justify-stretch">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClear}>
              Clear
            </Button>
            <Button type="button" className="flex-1" onClick={handleApply}>
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
