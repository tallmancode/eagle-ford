import type { Payload } from 'payload'

import { fetchMotorCityJson } from '@/lib/motor-city-stock/fetchMotorCity'
import { getStockApiConfig, buildStockUrl } from '@/lib/motor-city-stock/fetchStock'
import { buildStockFiltersUrl } from '@/lib/motor-city-stock/fetchStockFilters'
import { safeApiHost } from '@/lib/motor-city-stock/sentry'
import { MotorCityStockError } from '@/lib/motor-city-stock/types'
import type {
  MotorCityStockFilterOptions,
  MotorCityStockResponse,
} from '@/lib/motor-city-stock/types'

export type StockTestLogEntry = {
  at: string
  level: 'info' | 'error'
  message: string
  data?: unknown
}

export type StockConfigStatus = {
  apiHost: string | null
  urlConfigured: boolean
  keyConfigured: boolean
  dealerCode: string
}

export type StockConnectivityTestResult = {
  ok: boolean
  logs: StockTestLogEntry[]
  configStatus: StockConfigStatus
  sample?: {
    totalDocs?: number
    page?: number
    filtersOk?: boolean
  }
  error?: {
    message: string
    code?: string
    httpStatus?: number
    retryable?: boolean
  }
}

const DEFAULT_DEALER = 'EC167'

function log(
  logs: StockTestLogEntry[],
  level: StockTestLogEntry['level'],
  message: string,
  data?: unknown,
): void {
  logs.push({ at: new Date().toISOString(), level, message, data })
}

function readConfigStatus(): StockConfigStatus {
  const baseUrl = process.env.MOTOR_CITY_STOCK_API_URL?.trim() || ''
  const apiKey = process.env.MOTOR_CITY_STOCK_API_KEY?.trim() || ''

  return {
    apiHost: safeApiHost(baseUrl) ?? null,
    urlConfigured: Boolean(baseUrl),
    keyConfigured: Boolean(apiKey),
    dealerCode: DEFAULT_DEALER,
  }
}

function summarizeStockError(error: unknown): NonNullable<StockConnectivityTestResult['error']> {
  if (error instanceof MotorCityStockError) {
    return {
      message: error.message,
      code: error.code,
      httpStatus: error.status,
      retryable: error.retryable,
    }
  }

  return {
    message: error instanceof Error ? error.message : String(error),
  }
}

/**
 * Admin connectivity check against Motor City stock API using env credentials.
 * Does not call captureStockFetchEvent — failures stay in the structured result.
 */
export async function runStockConnectivityTest(args: {
  payload: Payload
}): Promise<StockConnectivityTestResult> {
  const logs: StockTestLogEntry[] = []
  const configStatus = readConfigStatus()

  log(logs, 'info', 'Reading MOTOR_CITY_STOCK_API_* from server environment', {
    apiHost: configStatus.apiHost,
    urlConfigured: configStatus.urlConfigured,
    keyConfigured: configStatus.keyConfigured,
    dealerCode: configStatus.dealerCode,
  })

  if (!configStatus.urlConfigured) {
    const message = 'MOTOR_CITY_STOCK_API_URL is not set in the server environment.'
    log(logs, 'error', message)
    await persistLastTest(args.payload, false, message)
    return { ok: false, logs, configStatus, error: { message, code: 'MISSING_URL' } }
  }

  if (!configStatus.keyConfigured) {
    const message = 'MOTOR_CITY_STOCK_API_KEY is not set in the server environment.'
    log(logs, 'error', message)
    await persistLastTest(args.payload, false, message)
    return { ok: false, logs, configStatus, error: { message, code: 'MISSING_KEY' } }
  }

  let baseUrl: string
  let apiKey: string
  try {
    ;({ baseUrl, apiKey } = getStockApiConfig())
  } catch (error) {
    const summarized = summarizeStockError(error)
    log(logs, 'error', 'Stock API config invalid', summarized)
    await persistLastTest(args.payload, false, summarized.message)
    return { ok: false, logs, configStatus, error: summarized }
  }

  const sample: StockConnectivityTestResult['sample'] = {}

  try {
    const listUrl = buildStockUrl(baseUrl, {
      dealerCode: DEFAULT_DEALER,
      limit: 1,
      page: 1,
    })
    log(logs, 'info', 'Fetching stock list (limit=1)', {
      path: listUrl.pathname + listUrl.search,
      apiHost: configStatus.apiHost,
    })

    const list = await fetchMotorCityJson<MotorCityStockResponse>({
      url: listUrl,
      apiKey,
      next: { revalidate: false },
      maxAttempts: 2,
      bypassCircuit: true,
    })

    sample.totalDocs = list.totalDocs
    sample.page = list.page
    log(logs, 'info', 'Stock list OK', {
      totalDocs: list.totalDocs,
      page: list.page,
      docsReturned: list.docs?.length ?? 0,
    })
  } catch (error) {
    const summarized = summarizeStockError(error)
    log(logs, 'error', 'Stock list request failed', summarized)
    await persistLastTest(args.payload, false, summarized.message)
    return { ok: false, logs, configStatus, sample, error: summarized }
  }

  try {
    const filtersUrl = buildStockFiltersUrl(baseUrl, { dealerCode: DEFAULT_DEALER })
    log(logs, 'info', 'Fetching stock filters', {
      path: filtersUrl.pathname,
      apiHost: configStatus.apiHost,
    })

    await fetchMotorCityJson<MotorCityStockFilterOptions>({
      url: filtersUrl,
      apiKey,
      next: { revalidate: false },
      maxAttempts: 2,
      bypassCircuit: true,
    })

    sample.filtersOk = true
    log(logs, 'info', 'Stock filters OK')
  } catch (error) {
    const summarized = summarizeStockError(error)
    sample.filtersOk = false
    log(logs, 'error', 'Stock filters request failed (list still succeeded)', summarized)
    const summary = `List OK (totalDocs=${sample.totalDocs ?? '?'}); filters failed: ${summarized.message}`
    await persistLastTest(args.payload, false, summary)
    return { ok: false, logs, configStatus, sample, error: summarized }
  }

  const summary = `Motor City stock OK via ${configStatus.apiHost} (dealer ${DEFAULT_DEALER}, totalDocs=${sample.totalDocs ?? 0})`
  log(logs, 'info', summary)
  await persistLastTest(args.payload, true, summary)

  return { ok: true, logs, configStatus, sample }
}

async function persistLastTest(payload: Payload, ok: boolean, summary: string): Promise<void> {
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      motorCity: {
        lastTestAt: new Date().toISOString(),
        lastTestOk: ok,
        lastTestSummary: summary,
      },
    },
    overrideAccess: true,
  })
}
