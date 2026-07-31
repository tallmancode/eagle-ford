import type { CollectionAfterChangeHook } from 'payload'

import { forwardFormSubmissionLead } from '@/lib/motor-city-leads/forwardLead'

/**
 * After a form submission is created, optionally forward the lead to Eagle Motor City.
 * Failures are persisted on the submission and retried via Payload jobs — never block email/confirmation.
 * There are no webhook-originated LMS lead paths on this satellite; forms are the only opt-in source.
 */
export const injectFormSubmissionLead: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'create') return doc
  if (context?.skipMotorCityLeadInject) return doc

  await forwardFormSubmissionLead({
    payload: req.payload,
    submission: doc,
    req,
  })

  return doc
}
