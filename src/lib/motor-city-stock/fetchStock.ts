import { fetchMotorCityJson } from '@/lib/motor-city-stock/fetchMotorCity'
import { captureStockFetchEvent, safeApiHost } from '@/lib/motor-city-stock/sentry'
import type { FetchStockOptions, MotorCityStockResponse } from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { CIRCUIT_OPEN_CODE } from '@/lib/motor-city-stock/upstreamCircuit'

function getStockApiConfig() {
  const baseUrl = process.env.MOTOR_CITY_STOCK_API_URL
  const apiKey = process.env.MOTOR_CITY_STOCK_API_KEY

  if (!baseUrl) {
    throw new MotorCityStockError('MOTOR_CITY_STOCK_API_URL is not configured', 500, {
      code: 'MISSING_URL',
      retryable: false,
    })
  }

  if (!apiKey) {
    throw new MotorCityStockError('MOTOR_CITY_STOCK_API_KEY is not configured', 500, {
      code: 'MISSING_KEY',
      retryable: false,
    })
  }

  return { baseUrl, apiKey }
}

function buildStockUrl(baseUrl: string, options: FetchStockOptions): URL {
  const dealerCode = options.dealerCode ?? 'EC167'

  const url = new URL(`/api/stock/${dealerCode}`, baseUrl)

  if (options.brand) url.searchParams.set('brand', options.brand)
  if (options.bodyType) url.searchParams.set('bodyType', options.bodyType)
  if (options.fuelType) url.searchParams.set('fuelType', options.fuelType)
  if (options.transmission) url.searchParams.set('transmission', options.transmission)
  if (options.newUsed) url.searchParams.set('newUsed', options.newUsed)
  if (options.model) url.searchParams.set('model', options.model)
  if (typeof options.maxMileage === 'number') {
    url.searchParams.set('maxMileage', String(options.maxMileage))
  }
  if (typeof options.minPrice === 'number') {
    url.searchParams.set('minPrice', String(options.minPrice))
  }
  if (typeof options.maxPrice === 'number') {
    url.searchParams.set('maxPrice', String(options.maxPrice))
  }
  if (typeof options.page === 'number') url.searchParams.set('page', String(options.page))
  if (typeof options.limit === 'number') url.searchParams.set('limit', String(options.limit))

  return url
}

export async function fetchStock(options: FetchStockOptions = {}): Promise<MotorCityStockResponse> {
  const { baseUrl, apiKey } = getStockApiConfig()
  const url = buildStockUrl(baseUrl, options)
  const dealerCode = options.dealerCode ?? 'EC167'

  try {
    return await fetchMotorCityJson<MotorCityStockResponse>({
      url,
      apiKey,
      next: { revalidate: 300 },
    })
  } catch (error) {
    const stockError =
      error instanceof MotorCityStockError
        ? error
        : new MotorCityStockError('Stock API request failed', 503, {
            code: 'NETWORK',
            retryable: true,
            cause: error,
          })

    if (stockError.code !== CIRCUIT_OPEN_CODE) {
      captureStockFetchEvent(stockError, {
        event: 'stock_list_failure',
        dealerCode,
        httpStatus: stockError.status,
        errorCode: stockError.code,
        retryable: stockError.retryable,
        apiHost: safeApiHost(baseUrl),
        detail: 'Failed to fetch Motor City stock list after retries',
      })
    }

    throw stockError
  }
}

export { buildStockUrl, getStockApiConfig }
