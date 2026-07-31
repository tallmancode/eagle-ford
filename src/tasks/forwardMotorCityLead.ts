import type { TaskHandler } from 'payload'

import { forwardFormSubmissionLead } from '@/lib/motor-city-leads/forwardLead'
import { captureLeadForwardEvent } from '@/lib/motor-city-leads/sentry'

export const forwardMotorCityLeadHandler: TaskHandler<'forwardMotorCityLead'> = async ({
  input,
  req,
}) => {
  const formSubmissionId = input.formSubmissionId
  if (!formSubmissionId) {
    throw new Error('formSubmissionId is required')
  }

  const submission = await req.payload.findByID({
    collection: 'form-submissions',
    id: formSubmissionId,
    depth: 0,
    overrideAccess: true,
    req,
  })

  const result = await forwardFormSubmissionLead({
    payload: req.payload,
    submission,
    req,
    skipEnqueue: false,
  })

  if (result.outcome === 'failed' && result.exhausted) {
    captureLeadForwardEvent(new Error(`Lead forward exhausted for ${formSubmissionId}`), {
      event: 'forward_exhausted',
      formSubmissionId: String(formSubmissionId),
      errorCode: result.code,
      attempt: result.attempt,
      detail: 'Job handler: durable lead forward exhausted',
    })
  }

  return {
    output: {
      outcome: result.outcome,
      status:
        result.outcome === 'success'
          ? result.status
          : result.outcome === 'pending_retry'
            ? 'pending_retry'
            : result.outcome === 'failed'
              ? 'failed'
              : result.reason,
    },
  }
}
