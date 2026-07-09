'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { MotorCityStockFilterOptions } from '@/lib/motor-city-stock/types'
import {
  filterStock,
  stockArchiveFiltersToSearchParams,
  type StockArchiveFilters,
  type StockArchiveVehicle,
} from '../utils'
import { StockArchiveGrid } from './StockArchiveGrid'
import { StockArchiveHeader } from './StockArchiveHeader'
import { StockArchiveToolbar } from './StockArchiveToolbar'

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
        bodyTypes={filterOptions.bodyTypes}
        selectedBodyType={activeFilters.bodyType}
        onBodyTypeChange={(bodyType) => navigateWithFilters({ bodyType, page: 1 })}
      />

      <StockArchiveToolbar
        vehicles={vehicles}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        currentPage={currentPage}
        totalPages={totalPages}
        totalDocs={totalDocs}
        limit={limit}
        showPagination={showPagination}
        onPageChange={(page) => navigateWithFilters({ page })}
        onModelChange={(model) => navigateWithFilters({ model, page: 1 })}
        onFuelTypeChange={(fuelType) => navigateWithFilters({ fuelType, page: 1 })}
        onTransmissionChange={(transmission) => navigateWithFilters({ transmission, page: 1 })}
        onPriceChange={(priceMin, priceMax) => navigateWithFilters({ priceMin, priceMax, page: 1 })}
        onMileageChange={(mileageMax) => navigateWithFilters({ mileageMax, page: 1 })}
      />

      <StockArchiveGrid vehicles={paginatedVehicles} enquireUrl={enquireUrl} />
    </div>
  )
}
