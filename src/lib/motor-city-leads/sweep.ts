import type { Payload, PayloadRequest } from 'payload'

import {
  LEAD_MAX_FORWARD_ATTEMPTS,
  LEAD_STATUS_PENDING_RETRY,
} from '@/lib/motor-city-leads/constants'
import { captureLeadForwardEvent } from '@/lib/motor-city-leads/sentry'
import { isRetryDue } from '@/lib/http/retryPolicy'

/**
 * Re-queues pending_retry form submissions whose nextRetryAt is due.
 * Safety net when waitUntil jobs were lost or enqueue failed.
 */
export async function sweepMotorCityLeads(args: {
  payload: Payload
  req?: PayloadRequest
  limit?: number
  nowMs?: number
}): Promise<{ examined: number; queued: number }> {
  const { payload, req } = args
  const limit = args.limit ?? 25
  const nowMs = args.nowMs ?? Date.now()
  const nowIso = new Date(nowMs).toISOString()

  const result = await payload.find({
    collection: 'form-submissions',
    depth: 0,
    limit,
    pagination: false,
    overrideAccess: true,
    req,
    where: {
      and: [
        { motorCityLeadStatus: { equals: LEAD_STATUS_PENDING_RETRY } },
        { motorCityLeadId: { exists: false } },
        {
          or: [
            { motorCityLeadNextRetryAt: { less_than_equal: nowIso } },
            { motorCityLeadNextRetryAt: { exists: false } },
          ],
        },
        {
          or: [
            { motorCityLeadAttempts: { less_than: LEAD_MAX_FORWARD_ATTEMPTS } },
            { motorCityLeadAttempts: { exists: false } },
          ],
        },
      ],
    },
    sort: 'motorCityLeadNextRetryAt',
  })

  let queued = 0

  for (const doc of result.docs) {
    const nextRetryAt =
      typeof doc.motorCityLeadNextRetryAt === 'string' ? doc.motorCityLeadNextRetryAt : null

    if (!isRetryDue(nextRetryAt, nowMs)) continue

    try {
      await payload.jobs.queue({
        task: 'forwardMotorCityLead',
        queue: 'motor-city-leads',
        input: { formSubmissionId: String(doc.id) },
        req,
      })
      queued += 1
    } catch (error) {
      captureLeadForwardEvent(error, {
        event: 'sweep_failure',
        formSubmissionId: String(doc.id),
        errorCode: 'SWEEP_ENQUEUE',
        detail: 'Sweeper failed to queue Motor City lead forward',
      })
    }
  }

  return { examined: result.docs.length, queued }
}
