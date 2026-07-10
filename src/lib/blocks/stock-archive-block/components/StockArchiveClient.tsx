'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { MotorCityStockFilterOptions } from '@/lib/motor-city-stock/types'
import {
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
  limit,
  showPagination,
  enquireUrl,
  pagination,
}: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const applyFilters = useCallback(
    (filters: StockArchiveFilters) => {
      const query = stockArchiveFiltersToSearchParams({ ...filters, page: 1 }).toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    },
    [pathname, router],
  )

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

  const currentPage = Math.min(activeFilters.page ?? 1, pagination.totalPages)

  return (
    <div>
      <StockArchiveHeader heading={heading} />

      <StockArchiveToolbar
        vehicles={vehicles}
        filterOptions={filterOptions}
        activeFilters={activeFilters}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalDocs={pagination.totalDocs}
        limit={limit}
        showPagination={showPagination}
        onPageChange={(page) => navigateWithFilters({ page })}
        onApplyFilters={applyFilters}
      />

      <StockArchiveGrid vehicles={vehicles} enquireUrl={enquireUrl} />
    </div>
  )
}
