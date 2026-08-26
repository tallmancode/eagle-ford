import { describe, expect, it } from 'vitest'

import {
  getThankYouPathForFormTitle,
  isThankYouSlug,
  resolveEnquiryFormIdentity,
} from '@/lib/forms/enquiryFormIdentity'

describe('enquiryFormIdentity', () => {
  it('maps known Ford form titles to marketing form_name values', () => {
    expect(resolveEnquiryFormIdentity('General Enquiry Form')?.formName).toBe('general_enquiry')
    expect(resolveEnquiryFormIdentity('New Vehicle Quote')?.formName).toBe('new_vehicle_quote')
    expect(resolveEnquiryFormIdentity('Used Vehicle Quote Form')?.formName).toBe(
      'used_vehicle_quote',
    )
    expect(resolveEnquiryFormIdentity('Special Offer Enquiry Form')?.formName).toBe('special_offer')
    expect(resolveEnquiryFormIdentity('Test Drive Booking Form')?.formName).toBe('test_drive')
    expect(resolveEnquiryFormIdentity('Sell Your Car')?.formName).toBe('sell_your_car')
    expect(resolveEnquiryFormIdentity('Service Booking Form')?.formName).toBe('service_booking')
    expect(resolveEnquiryFormIdentity('Parts Enquiry Form')?.formName).toBe('parts')
    expect(resolveEnquiryFormIdentity('Wheel & Tyre Enquiry Form')?.formName).toBe('wheel_tyre')
    expect(resolveEnquiryFormIdentity('Paint and Panel Enquiry Form')?.formName).toBe('paint_panel')
  })

  it('routes sales vs service thank-you paths', () => {
    expect(getThankYouPathForFormTitle('General Enquiry Form')).toBe('/sales-form-submitted')
    expect(getThankYouPathForFormTitle('Wheel & Tyre Enquiry Form')).toBe(
      '/service-form-submitted',
    )
    expect(getThankYouPathForFormTitle('Paint & Panel Enquiry Form')).toBe(
      '/service-form-submitted',
    )
  })

  it('recognises thank-you slugs', () => {
    expect(isThankYouSlug('sales-form-submitted')).toBe(true)
    expect(isThankYouSlug('service-form-submitted')).toBe(true)
    expect(isThankYouSlug('contact')).toBe(false)
  })
})
