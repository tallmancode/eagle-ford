import { unstable_cache } from 'next/cache'

import { fetchStockVehicle } from '@/lib/motor-city-stock/fetchStockVehicle'
import type { FetchStockVehicleOptions, MotorCityStockVehicle } from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'

async function fetchStockVehicleCached(
  options: FetchStockVehicleOptions,
): Promise<MotorCityStockVehicle | null> {
  try {
    const response = await fetchStockVehicle(options)
    return response.vehicle
  } catch (error) {
    if (error instanceof MotorCityStockError && error.status === 404) {
      return null
    }
    throw error
  }
}

export async function getCachedStockVehicle(
  cmsId: string,
  options: Omit<FetchStockVehicleOptions, 'cmsId'> = {},
): Promise<MotorCityStockVehicle | null> {
  const fetchOptions: FetchStockVehicleOptions = {
    cmsId,
    dealerCode: options.dealerCode ?? 'EC167',
  }

  const cached = unstable_cache(
    () => fetchStockVehicleCached(fetchOptions),
    ['motor-city-stock-vehicle', fetchOptions.dealerCode ?? 'EC167', cmsId],
    {
      tags: ['motor-city-stock-vehicle', `motor-city-stock-vehicle-${cmsId}`],
      revalidate: 300,
    },
  )

  return cached()
}
