import type {
  FetchStockFiltersOptions,
  MotorCityStockFilterOptions,
} from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { getStockApiConfig } from '@/lib/motor-city-stock/fetchStock'

function buildStockFiltersUrl(baseUrl: string, options: FetchStockFiltersOptions = {}): URL {
  const dealerCode = options.dealerCode ?? 'EC167'
  const brandKey = options.brandKey ?? process.env.MOTOR_CITY_STOCK_BRAND_KEY ?? 'ford'

  const url = new URL(`/api/stock/${dealerCode}/filters`, baseUrl)
  url.searchParams.set('brandKey', brandKey)

  return url
}

export async function fetchStockFilters(
  options: FetchStockFiltersOptions = {},
): Promise<MotorCityStockFilterOptions> {
  const { baseUrl, apiKey } = getStockApiConfig()
  const url = buildStockFiltersUrl(baseUrl, options)

  const response = await fetch(url, {
    headers: {
      Authorization: `stock-api-clients API-Key ${apiKey}`,
    },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    let message = `Stock filters API request failed with status ${response.status}`

    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore JSON parse errors
    }

    throw new MotorCityStockError(message, response.status)
  }

  return (await response.json()) as MotorCityStockFilterOptions
}

export { buildStockFiltersUrl }
