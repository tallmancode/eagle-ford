import type { Field } from 'payload'

/** Structured ad / UTM attribution stored on form-submissions (issue #357). */
export function getFormSubmissionAttributionFields(): Field[] {
  return [
    {
      name: 'attribution',
      type: 'group',
      admin: {
        readOnly: true,
        description:
          'Captured from the visitor landing URL (gclid / UTMs). gclid is retained 90 days from capture — see expiresAt.',
      },
      fields: [
        { name: 'gclid', type: 'text', admin: { readOnly: true } },
        { name: 'gbraid', type: 'text', admin: { readOnly: true } },
        { name: 'wbraid', type: 'text', admin: { readOnly: true } },
        { name: 'utm_source', type: 'text', admin: { readOnly: true } },
        { name: 'utm_medium', type: 'text', admin: { readOnly: true } },
        { name: 'utm_campaign', type: 'text', admin: { readOnly: true } },
        { name: 'utm_term', type: 'text', admin: { readOnly: true } },
        { name: 'utm_content', type: 'text', admin: { readOnly: true } },
        { name: 'landing_page', type: 'text', admin: { readOnly: true } },
        { name: 'referrer', type: 'text', admin: { readOnly: true } },
        { name: 'capturedAt', type: 'text', admin: { readOnly: true } },
        { name: 'expiresAt', type: 'text', admin: { readOnly: true } },
      ],
    },
  ]
}
