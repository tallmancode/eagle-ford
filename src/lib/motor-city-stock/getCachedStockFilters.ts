import { unstable_cache } from 'next/cache'

import { fetchStockFilters } from '@/lib/motor-city-stock/fetchStockFilters'
import type {
  FetchStockFiltersOptions,
  MotorCityStockFilterOptions,
} from '@/lib/motor-city-stock/types'

function cacheKeyFromOptions(options: FetchStockFiltersOptions): string {
  return JSON.stringify({
    dealerCode: options.dealerCode ?? 'EC167',
    brandKey: options.brandKey ?? process.env.MOTOR_CITY_STOCK_BRAND_KEY ?? 'ford',
  })
}

async function fetchStockFiltersCached(
  options: FetchStockFiltersOptions,
): Promise<MotorCityStockFilterOptions> {
  return fetchStockFilters(options)
}

export async function getCachedStockFilters(
  options: FetchStockFiltersOptions = {},
): Promise<MotorCityStockFilterOptions> {
  const cacheKey = cacheKeyFromOptions(options)

  const cached = unstable_cache(
    () => fetchStockFiltersCached(options),
    ['motor-city-stock-filters', cacheKey],
    {
      tags: ['motor-city-stock-filters'],
      revalidate: 300,
    },
  )

  return cached()
}
