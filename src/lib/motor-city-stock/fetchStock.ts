import type { FetchStockOptions, MotorCityStockResponse } from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'

function getStockApiConfig() {
  const baseUrl = process.env.MOTOR_CITY_STOCK_API_URL
  const apiKey = process.env.MOTOR_CITY_STOCK_API_KEY

  if (!baseUrl) {
    throw new MotorCityStockError('MOTOR_CITY_STOCK_API_URL is not configured', 500)
  }

  if (!apiKey) {
    throw new MotorCityStockError('MOTOR_CITY_STOCK_API_KEY is not configured', 500)
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

  const response = await fetch(url, {
    headers: {
      Authorization: `stock-api-clients API-Key ${apiKey}`,
    },
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    let message = `Stock API request failed with status ${response.status}`

    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore JSON parse errors
    }

    throw new MotorCityStockError(message, response.status)
  }

  return (await response.json()) as MotorCityStockResponse
}

export { buildStockUrl, getStockApiConfig }
