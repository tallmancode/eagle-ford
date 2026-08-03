import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import { runStockConnectivityTest } from '@/lib/motor-city-stock/runStockConnectivityTest'
import { isPayloadUser } from '@/lib/utils/accessUtil'

/**
 * Admin/developer: verify Motor City stock API env + connectivity. Returns structured logs.
 */
export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (
    !isPayloadUser(user) ||
    !(user.roles?.includes('admin') || user.roles?.includes('developer'))
  ) {
    return Response.json({ message: 'Action forbidden.' }, { status: 403 })
  }

  const result = await runStockConnectivityTest({ payload })

  return Response.json(result, { status: result.ok ? 200 : 422 })
}
