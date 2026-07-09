import type {
  FetchStockVehicleOptions,
  MotorCityStockVehicleResponse,
} from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { getStockApiConfig } from '@/lib/motor-city-stock/fetchStock'

function buildStockVehicleUrl(baseUrl: string, options: FetchStockVehicleOptions): URL {
  const dealerCode = options.dealerCode ?? 'EC167'
  return new URL(`/api/stock/${dealerCode}/vehicles/${encodeURIComponent(options.cmsId)}`, baseUrl)
}

export async function fetchStockVehicle(
  options: FetchStockVehicleOptions,
): Promise<MotorCityStockVehicleResponse> {
  const { baseUrl, apiKey } = getStockApiConfig()
  const url = buildStockVehicleUrl(baseUrl, options)

  const response = await fetch(url, {
    headers: {
      Authorization: `stock-api-clients API-Key ${apiKey}`,
    },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    let message = `Stock vehicle API request failed with status ${response.status}`

    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore JSON parse errors
    }

    throw new MotorCityStockError(message, response.status)
  }

  return (await response.json()) as MotorCityStockVehicleResponse
}

export { buildStockVehicleUrl }
