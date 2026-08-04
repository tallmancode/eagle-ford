import { describe, expect, it } from 'vitest'

import { mapFormSubmissionToLeadRequest } from '@/lib/motor-city-leads/mapFormSubmission'

describe('mapFormSubmissionToLeadRequest', () => {
  it('maps common form fields with defaults', () => {
    const result = mapFormSubmissionToLeadRequest({
      extLeadRef: 'sub-1',
      formTitle: 'Vehicle Quote',
      formConfig: {
        enabled: true,
        dealerRef: 'EC167',
        dealerFloor: 'NEWFORD',
        source: 'EAGLE-DEALERWEBSITE',
        defaultUsed: '0',
        defaultBrand: 'Ford',
        defaultModel: 'General Enquiry',
        commentsPrefix: 'Website',
        fieldMappings: [],
      },
      submissionData: [
        { field: 'firstName', value: 'Jane' },
        { field: 'lastName', value: 'Doe' },
        { field: 'phone', value: '0821234567' },
        { field: 'email', value: 'jane@example.com' },
        { field: 'modelName', value: 'Ranger XLT' },
        { field: 'message', value: 'Please call me' },
      ],
    })

    expect(result.request.siteKey).toBe('eagle-ford')
    expect(result.request.contact.firstName).toBe('Jane')
    expect(result.request.contact.surname).toBe('Doe')
    expect(result.request.contact.cellPhone).toBe('0821234567')
    expect(result.request.seeks.brand).toBe('Ford')
    expect(result.request.seeks.model).toBe('Ranger XLT')
    expect(result.request.seeks.comments).toContain('Website')
    expect(result.request.seeks.comments).toContain('Please call me')
  })
})
