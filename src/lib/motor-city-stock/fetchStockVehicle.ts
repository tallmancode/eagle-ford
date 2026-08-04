import type {
  FetchStockVehicleOptions,
  MotorCityStockVehicleResponse,
} from '@/lib/motor-city-stock/types'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import { getStockApiConfig } from '@/lib/motor-city-stock/fetchStock'
import { fetchMotorCityJson } from '@/lib/motor-city-stock/fetchMotorCity'
import { captureStockFetchEvent, safeApiHost } from '@/lib/motor-city-stock/sentry'
import { CIRCUIT_OPEN_CODE } from '@/lib/motor-city-stock/upstreamCircuit'

function buildStockVehicleUrl(baseUrl: string, options: FetchStockVehicleOptions): URL {
  const dealerCode = options.dealerCode ?? 'EC167'
  return new URL(`/api/stock/${dealerCode}/vehicles/${encodeURIComponent(options.cmsId)}`, baseUrl)
}

export async function fetchStockVehicle(
  options: FetchStockVehicleOptions,
): Promise<MotorCityStockVehicleResponse> {
  const { baseUrl, apiKey } = getStockApiConfig()
  const url = buildStockVehicleUrl(baseUrl, options)
  const dealerCode = options.dealerCode ?? 'EC167'

  try {
    return await fetchMotorCityJson<MotorCityStockVehicleResponse>({
      url,
      apiKey,
      next: { revalidate: 300 },
      // Single-vehicle lookups must not trip (or be blocked by) the shared list circuit.
      bypassCircuit: true,
      openCircuitOnFailure: false,
    })
  } catch (error) {
    const stockError =
      error instanceof MotorCityStockError
        ? error
        : new MotorCityStockError('Stock vehicle API request failed', 503, {
            code: 'NETWORK',
            retryable: true,
            cause: error,
          })

    // 404 is expected for removed stock — do not alert.
    // Circuit-open fail-fast follows a prior captured failure — breadcrumb only via skip.
    if (stockError.status !== 404 && stockError.code !== CIRCUIT_OPEN_CODE) {
      captureStockFetchEvent(stockError, {
        event: 'stock_vehicle_failure',
        dealerCode,
        httpStatus: stockError.status,
        errorCode: stockError.code,
        retryable: stockError.retryable,
        apiHost: safeApiHost(baseUrl),
        detail: 'Failed to fetch Motor City stock vehicle after retries',
      })
    }

    throw stockError
  }
}

export { buildStockVehicleUrl }
