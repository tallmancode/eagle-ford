import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { fetchStockVehicle } from '@/lib/motor-city-stock/fetchStockVehicle'
import {
  forgetLastGoodVehicle,
  getLastGoodVehicle,
  rememberLastGoodVehicle,
} from '@/lib/motor-city-stock/lastGoodVehicleCache'
import type { FetchStockVehicleOptions, MotorCityStockVehicle } from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'

function isInactiveVehicle(vehicle: MotorCityStockVehicle): boolean {
  return vehicle.isActive === false
}

/**
 * Fetch a vehicle; on retryable upstream failure return last-good if present.
 * Sold/inactive or missing vehicles return null (404) rather than StockArchiveError.
 * Exported for tests — production callers should use getCachedStockVehicle.
 */
export async function loadStockVehicleWithFallback(
  options: FetchStockVehicleOptions,
): Promise<MotorCityStockVehicle | null> {
  const dealerCode = options.dealerCode ?? 'EC167'

  try {
    const response = await fetchStockVehicle(options)

    if (isInactiveVehicle(response.vehicle)) {
      forgetLastGoodVehicle(dealerCode, options.cmsId)
      return null
    }

    rememberLastGoodVehicle(dealerCode, options.cmsId, response.vehicle)
    return response.vehicle
  } catch (error) {
    if (error instanceof MotorCityStockError && error.status === 404) {
      forgetLastGoodVehicle(dealerCode, options.cmsId)
      return null
    }

    // Intermittent Motor City 502/503: serve last successful payload for this process
    // so showroom detail stays available instead of StockArchiveError.
    if (error instanceof MotorCityStockError && error.retryable) {
      const stale = getLastGoodVehicle(dealerCode, options.cmsId)
      if (stale) return stale
      return null
    }

    throw error
  }
}

/**
 * Request-level dedupe (React cache) + cross-request Data Cache (unstable_cache).
 * Call as `await getCachedStockVehicle(cmsId)` or with optional dealerCode options.
 */
export function getCachedStockVehicle(
  cmsId: string,
  options: Omit<FetchStockVehicleOptions, 'cmsId'> = {},
): Promise<MotorCityStockVehicle | null> {
  return getCachedStockVehicleCached(cmsId, options.dealerCode ?? 'EC167')
}

const getCachedStockVehicleCached = cache(
  async (cmsId: string, dealerCode: string): Promise<MotorCityStockVehicle | null> =>
    unstable_cache(
      () => loadStockVehicleWithFallback({ cmsId, dealerCode }),
      ['motor-city-stock-vehicle', dealerCode, cmsId],
      {
        tags: ['motor-city-stock-vehicle', `motor-city-stock-vehicle-${cmsId}`],
        revalidate: 300,
      },
    )(),
)
