import type { StockArchive } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { getCachedStock, getCachedStockFilters } from '@/lib/motor-city-stock'
import type { FetchStockOptions, MotorCityStockVehicle } from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { captureStockFetchEvent } from '@/lib/motor-city-stock/sentry'
import {
  compareStockForShowroom,
  paginateSortedStock,
  parseStockArchiveSearchParams,
  stockArchiveFiltersToFetchOptions,
} from '../utils'
import { StockArchiveClient } from './StockArchiveClient'
import { StockArchiveError } from './StockArchiveError'

/** Motor City API max page size — used when fetching the full filtered set for local sort. */
const STOCK_FETCH_PAGE_SIZE = 100

type Props = StockArchive & { meta?: BlockRenderMeta }

async function fetchAllFilteredStock(options: FetchStockOptions): Promise<MotorCityStockVehicle[]> {
  const docs: MotorCityStockVehicle[] = []
  let page = 1

  while (true) {
    const response = await getCachedStock({
      dealerCode: options.dealerCode,
      brand: options.brand,
      bodyType: options.bodyType,
      fuelType: options.fuelType,
      transmission: options.transmission,
      newUsed: options.newUsed,
      model: options.model,
      maxMileage: options.maxMileage,
      minPrice: options.minPrice,
      maxPrice: options.maxPrice,
      page,
      limit: STOCK_FETCH_PAGE_SIZE,
    })

    docs.push(...response.docs)

    if (!response.hasNextPage) {
      break
    }

    page += 1
  }

  return docs
}

const EMPTY_FILTER_OPTIONS = {
  dealerCode: null as string | null,
  bodyTypes: [],
  brands: [],
  fuelTypes: [],
  transmissions: [],
  models: [],
  newUsed: [],
  priceRange: { min: null as number | null, max: null as number | null },
}

export async function StockArchiveBlockComponent(props: Props) {
  const {
    conditionFilter = 'all',
    limit = 12,
    showPagination = true,
    meta,
  } = props

  const activeFilters = parseStockArchiveSearchParams(meta?.searchParams)
  const pageLimit = limit ?? 12

  const newUsed =
    conditionFilter === 'new'
      ? ('NEW' as const)
      : conditionFilter === 'pre-owned'
        ? ('USED' as const)
        : undefined

  let errorMessage: string | null = null
  let filterOptions: Awaited<ReturnType<typeof getCachedStockFilters>> | null = null
  let paginated: ReturnType<typeof paginateSortedStock> | null = null

  try {
    const fetchOptions = stockArchiveFiltersToFetchOptions(activeFilters, {
      newUsed,
      limit: STOCK_FETCH_PAGE_SIZE,
    })

    const [filtersSettled, stockSettled] = await Promise.allSettled([
      getCachedStockFilters(),
      fetchAllFilteredStock(fetchOptions),
    ])

    if (stockSettled.status === 'rejected') {
      const error = stockSettled.reason
      if (error instanceof MotorCityStockError) {
        errorMessage = error.message
      } else {
        errorMessage = 'Unable to load stock at this time.'
        captureStockFetchEvent(error, {
          event: 'stock_list_failure',
          detail: 'Stock archive block failed to load vehicles',
        })
      }
    } else {
      const allDocs = stockSettled.value
      const sorted = [...allDocs].sort(compareStockForShowroom)
      paginated = paginateSortedStock(sorted, activeFilters.page ?? 1, pageLimit)

      if (filtersSettled.status === 'fulfilled') {
        filterOptions = filtersSettled.value
      } else {
        // Soft-fail filters so listing still renders when filters endpoint blips.
        filterOptions = EMPTY_FILTER_OPTIONS
        captureStockFetchEvent(filtersSettled.reason, {
          event: 'stock_filters_failure',
          detail: 'Stock archive filters failed; rendering list with empty filter options',
          retryable: true,
        })
      }
    }
  } catch (error) {
    if (error instanceof MotorCityStockError) {
      errorMessage = error.message
    } else {
      errorMessage = 'Unable to load stock at this time.'
      captureStockFetchEvent(error, {
        event: 'stock_list_failure',
        detail: 'Stock archive block unexpected failure',
      })
    }
  }

  if (errorMessage) {
    return <StockArchiveError />
  }

  if (!filterOptions || !paginated) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-light-50 p-12 text-center">
        <p className="text-neutral-600">No vehicles available yet.</p>
      </div>
    )
  }

  return (
    <StockArchiveClient
      vehicles={paginated.docs}
      filterOptions={filterOptions}
      activeFilters={activeFilters}
      limit={pageLimit}
      showPagination={showPagination ?? true}
      pagination={{
        page: paginated.page,
        totalPages: paginated.totalPages,
        totalDocs: paginated.totalDocs,
      }}
    />
  )
}
