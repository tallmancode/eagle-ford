import type { Field } from 'payload'

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
        description: 'Last known Motor City / LMS push status',
      },
    },
    {
      name: 'motorCityLeadError',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: 'Error from the last Motor City lead forward attempt',
      },
    },
  ]
}
