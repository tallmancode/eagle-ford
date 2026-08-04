import type {
  FetchStockFiltersOptions,
  MotorCityStockFilterOptions,
} from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { getStockApiConfig } from '@/lib/motor-city-stock/fetchStock'
import { fetchMotorCityJson } from '@/lib/motor-city-stock/fetchMotorCity'
import { captureStockFetchEvent, safeApiHost } from '@/lib/motor-city-stock/sentry'
import { CIRCUIT_OPEN_CODE } from '@/lib/motor-city-stock/upstreamCircuit'

function buildStockFiltersUrl(baseUrl: string, options: FetchStockFiltersOptions = {}): URL {
  const dealerCode = options.dealerCode ?? 'EC167'

  return new URL(`/api/stock/${dealerCode}/filters`, baseUrl)
}

export async function fetchStockFilters(
  options: FetchStockFiltersOptions = {},
): Promise<MotorCityStockFilterOptions> {
  const { baseUrl, apiKey } = getStockApiConfig()
  const url = buildStockFiltersUrl(baseUrl, options)
  const dealerCode = options.dealerCode ?? 'EC167'

  try {
    return await fetchMotorCityJson<MotorCityStockFilterOptions>({
      url,
      apiKey,
      next: { revalidate: 300 },
    })
  } catch (error) {
    const stockError =
      error instanceof MotorCityStockError
        ? error
        : new MotorCityStockError('Stock filters API request failed', 503, {
            code: 'NETWORK',
            retryable: true,
            cause: error,
          })

    if (stockError.code !== CIRCUIT_OPEN_CODE) {
      captureStockFetchEvent(stockError, {
        event: 'stock_filters_failure',
        dealerCode,
        httpStatus: stockError.status,
        errorCode: stockError.code,
        retryable: stockError.retryable,
        apiHost: safeApiHost(baseUrl),
        detail: 'Failed to fetch Motor City stock filters after retries',
      })
    }

    throw stockError
  }
}

export { buildStockFiltersUrl }
