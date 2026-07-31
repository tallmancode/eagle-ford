import type { Field } from 'payload'

import {
  LEAD_MAX_FORWARD_ATTEMPTS,
  LEAD_STATUS_EXHAUSTED,
  LEAD_STATUS_FAILED,
  LEAD_STATUS_PENDING_RETRY,
} from '@/lib/motor-city-leads/constants'

/** Read-only status fields stored on form-submissions after Motor City ingest. */
export function getMotorCityLeadSubmissionFields(): Field[] {
  return [
    {
      name: 'motorCityLeadId',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Eagle Motor City site-form-leads document id',
      },
    },
    {
      name: 'motorCityLeadStatus',
      type: 'text',
      admin: {
        readOnly: true,
        description: `Last known Motor City / LMS push status (${LEAD_STATUS_PENDING_RETRY}, queued, ${LEAD_STATUS_FAILED}, ${LEAD_STATUS_EXHAUSTED}, …)`,
      },
    },
    {
      name: 'motorCityLeadError',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: 'Error from the last Motor City lead forward attempt (no PII beyond field labels)',
      },
    },
    {
      name: 'motorCityLeadAttempts',
      type: 'number',
      admin: {
        readOnly: true,
        description: `Durable forward attempts so far (max ${LEAD_MAX_FORWARD_ATTEMPTS})`,
      },
    },
    {
      name: 'motorCityLeadNextRetryAt',
      type: 'date',
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Earliest time the sweeper may retry a pending_retry forward',
      },
    },
    {
      name: 'motorCityLeadRetryable',
      type: 'checkbox',
      admin: {
        readOnly: true,
        description: 'Whether the last failure was classified as transient',
      },
    },
  ]
}
