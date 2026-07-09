'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { MotorCityStockFilterOptions } from '@/lib/motor-city-stock/types'
import {
  filterStock,
  stockArchiveFiltersToSearchParams,
  type StockArchiveFilters,
  type StockArchiveVehicle,
} from '../utils'
import { StockArchiveFilters as FiltersSidebar } from './StockArchiveFilters'
import { StockArchiveGrid } from './StockArchiveGrid'
import { StockArchiveHeader } from './StockArchiveHeader'

type Props = {
  heading: string
  vehicles: StockArchiveVehicle[]
  filterOptions: MotorCityStockFilterOptions
  activeFilters: StockArchiveFilters
  hasClientOnlyFilters: boolean
  limit: number
  showPagination: boolean
  enquireUrl: string
  pagination: {
    page: number
    totalPages: number
    totalDocs: number
  }
}

export function StockArchiveClient({
  heading,
  vehicles,
  filterOptions,
  activeFilters,
  hasClientOnlyFilters,
  limit,
  showPagination,
  enquireUrl,
  pagination,
}: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const navigateWithFilters = useCallback(
    (updates: Partial<StockArchiveFilters>) => {
      const next: StockArchiveFilters = { ...activeFilters, ...updates }

      if (!('page' in updates)) {
        next.page = 1
      }

      const query = stockArchiveFiltersToSearchParams(next).toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    },
    [activeFilters, pathname, router],
  )

  const clientFilteredVehicles = hasClientOnlyFilters
    ? filterStock(vehicles, {
        model: activeFilters.model,
        mileageMax: activeFilters.mileageMax,
      })
    : vehicles

  const totalDocs = hasClientOnlyFilters ? clientFilteredVehicles.length : pagination.totalDocs
  const totalPages = hasClientOnlyFilters
    ? Math.max(1, Math.ceil(clientFilteredVehicles.length / limit))
    : pagination.totalPages
  const currentPage = Math.min(activeFilters.page ?? 1, totalPages)

  const paginatedVehicles = hasClientOnlyFilters
    ? clientFilteredVehicles.slice((currentPage - 1) * limit, currentPage * limit)
    : clientFilteredVehicles

  return (
    <div>
      <StockArchiveHeader
        heading={heading}
        count={totalDocs}
        bodyTypes={filterOptions.bodyTypes}
        selectedBodyType={activeFilters.bodyType}
        onBodyTypeChange={(bodyType) => navigateWithFilters({ bodyType, page: 1 })}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FiltersSidebar
          vehicles={vehicles}
          filterOptions={filterOptions}
          selectedModel={activeFilters.model}
          selectedFuelType={activeFilters.fuelType}
          selectedTransmission={activeFilters.transmission}
          priceMin={activeFilters.priceMin}
          priceMax={activeFilters.priceMax}
          mileageMax={activeFilters.mileageMax}
          onModelChange={(model) => navigateWithFilters({ model, page: 1 })}
          onFuelTypeChange={(fuelType) => navigateWithFilters({ fuelType, page: 1 })}
          onTransmissionChange={(transmission) => navigateWithFilters({ transmission, page: 1 })}
          onPriceChange={(priceMin, priceMax) =>
            navigateWithFilters({ priceMin, priceMax, page: 1 })
          }
          onMileageChange={(mileageMax) => navigateWithFilters({ mileageMax, page: 1 })}
        />

        <div>
          <StockArchiveGrid vehicles={paginatedVehicles} enquireUrl={enquireUrl} />

          {showPagination && totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (currentPage > 1) navigateWithFilters({ page: currentPage - 1 })
                    }}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => navigateWithFilters({ page })}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < totalPages) navigateWithFilters({ page: currentPage + 1 })
                    }}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}
