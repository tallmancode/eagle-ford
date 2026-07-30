import type { TaskHandler } from 'payload'

import { sweepMotorCityLeads } from '@/lib/motor-city-leads/sweep'
import { captureLeadForwardEvent } from '@/lib/motor-city-leads/sentry'

export const sweepMotorCityLeadsHandler: TaskHandler<'sweepMotorCityLeads'> = async ({ req }) => {
  try {
    const result = await sweepMotorCityLeads({
      payload: req.payload,
      req,
    })

    return {
      output: {
        examined: result.examined,
        queued: result.queued,
      },
    }
  } catch (error) {
    captureLeadForwardEvent(error, {
      event: 'sweep_failure',
      errorCode: 'SWEEP_FATAL',
      detail: 'sweepMotorCityLeads task failed',
    })
    throw error
  }
}
