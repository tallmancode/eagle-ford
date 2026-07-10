import type { StockArchive } from '@/payload-types'
import type { BlockRenderMeta } from '@/lib/blocks/form-block/types/formContext'
import { getCachedStock, getCachedStockFilters } from '@/lib/motor-city-stock'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { parseStockArchiveSearchParams, stockArchiveFiltersToFetchOptions } from '../utils'
import { StockArchiveClient } from './StockArchiveClient'
import { StockArchiveError } from './StockArchiveError'

type Props = StockArchive & { meta?: BlockRenderMeta }

export async function StockArchiveBlockComponent(props: Props) {
  const {
    heading = 'Our Showroom',
    conditionFilter = 'all',
    limit = 12,
    showPagination = true,
    enquireUrl = '/contact',
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
  let stockResponse: Awaited<ReturnType<typeof getCachedStock>> | null = null

  try {
    const fetchOptions = stockArchiveFiltersToFetchOptions(activeFilters, {
      newUsed,
      limit: pageLimit,
    })

    const [filtersResult, stockResult] = await Promise.all([
      getCachedStockFilters(),
      getCachedStock(fetchOptions),
    ])

    filterOptions = filtersResult
    stockResponse = stockResult
  } catch (error) {
    if (error instanceof MotorCityStockError) {
      errorMessage = error.message
    } else {
      errorMessage = 'Unable to load stock at this time.'
    }
  }

  if (errorMessage) {
    return <StockArchiveError />
  }

  if (!filterOptions || !stockResponse) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-light-50 p-12 text-center">
        <p className="text-neutral-600">No vehicles available yet.</p>
      </div>
    )
  }

  return (
    <StockArchiveClient
      heading={heading ?? 'Our Showroom'}
      vehicles={stockResponse.docs}
      filterOptions={filterOptions}
      activeFilters={activeFilters}
      limit={pageLimit}
      showPagination={showPagination ?? true}
      enquireUrl={enquireUrl ?? '/contact'}
      pagination={{
        page: stockResponse.page ?? 1,
        totalPages: stockResponse.totalPages ?? 1,
        totalDocs: stockResponse.totalDocs ?? 0,
      }}
    />
  )
}
