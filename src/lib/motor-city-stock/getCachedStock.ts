import { unstable_cache } from 'next/cache'

import { fetchStock } from '@/lib/motor-city-stock/fetchStock'
import type { FetchStockOptions, MotorCityStockResponse } from '@/lib/motor-city-stock/types'

function cacheKeyFromOptions(options: FetchStockOptions): string {
  return JSON.stringify({
    dealerCode: options.dealerCode ?? 'EC167',
    brandKey: options.brandKey ?? process.env.MOTOR_CITY_STOCK_BRAND_KEY ?? 'ford',
    brand: options.brand ?? null,
    newUsed: options.newUsed ?? null,
    minPrice: options.minPrice ?? null,
    maxPrice: options.maxPrice ?? null,
    page: options.page ?? 1,
    limit: options.limit ?? 24,
  })
}

async function fetchStockCached(options: FetchStockOptions): Promise<MotorCityStockResponse> {
  return fetchStock(options)
}

export async function getCachedStock(
  options: FetchStockOptions = {},
): Promise<MotorCityStockResponse> {
  const cacheKey = cacheKeyFromOptions(options)

  const cached = unstable_cache(() => fetchStockCached(options), ['motor-city-stock', cacheKey], {
    tags: ['motor-city-stock'],
    revalidate: 300,
  })

  return cached()
}
