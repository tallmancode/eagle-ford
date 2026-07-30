import type { MotorCitySiteFormLeadRequest } from '@/lib/motor-city-leads/types'
import { MotorCityLeadsError } from '@/lib/motor-city-leads/types'

function getMotorCityConfig() {
  const baseUrl = process.env.MOTOR_CITY_STOCK_API_URL
  const apiKey = process.env.MOTOR_CITY_STOCK_API_KEY

  if (!baseUrl) {
    throw new MotorCityLeadsError('MOTOR_CITY_STOCK_API_URL is not configured', {
      code: 'MISSING_URL',
    })
  }

  if (!apiKey) {
    throw new MotorCityLeadsError('MOTOR_CITY_STOCK_API_KEY is not configured', {
      code: 'MISSING_KEY',
    })
  }

  return { baseUrl, apiKey }
}

export type SubmitSiteFormLeadResult = {
  ok: true
  id: string
  status: string
  created: boolean
  lmsLeadReference?: string | null
}

/**
 * POSTs a normalized lead to Eagle Motor City for CMS LMS injection.
 * Uses the same stock-api-clients API key as the stock integration.
 */
export async function submitSiteFormLead(
  body: MotorCitySiteFormLeadRequest,
): Promise<SubmitSiteFormLeadResult> {
  const { baseUrl, apiKey } = getMotorCityConfig()
  const url = new URL('/api/leads/site-forms', baseUrl)

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `stock-api-clients API-Key ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    })
  } catch (error) {
    throw new MotorCityLeadsError('Failed to reach Eagle Motor City lead API', {
      code: 'NETWORK',
      cause: error,
    })
  }

  const json = (await response.json().catch(() => null)) as {
    ok?: boolean
    id?: string
    status?: string
    created?: boolean
    lmsLeadReference?: string | null
    error?: string
  } | null

  if (!response.ok) {
    throw new MotorCityLeadsError(json?.error || `Motor City lead API HTTP ${response.status}`, {
      code: 'HTTP',
      status: response.status,
    })
  }

  if (!json?.id) {
    throw new MotorCityLeadsError('Motor City lead API returned an unexpected body', {
      code: 'BAD_BODY',
    })
  }

  return {
    ok: true,
    id: json.id,
    status: json.status ?? 'queued',
    created: Boolean(json.created),
    lmsLeadReference: json.lmsLeadReference ?? null,
  }
}
