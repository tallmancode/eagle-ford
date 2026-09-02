import { describe, expect, it } from 'vitest'

import {
  getFormDisplayLabel,
  getThankYouPathForForm,
  getThankYouPathForFormTitle,
  isThankYouSlug,
  resolveEnquiryFormIdentity,
  resolveEnquiryFormIdentityByFormName,
  resolveEnquiryFormIdentityFromForm,
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
    expect(resolveEnquiryFormIdentity('Sell Enquiry Form')?.formName).toBe('sell_your_car')
    expect(resolveEnquiryFormIdentity('Service Booking Form')?.formName).toBe('service_booking')
    expect(resolveEnquiryFormIdentity('Parts Enquiry Form')?.formName).toBe('parts')
    expect(resolveEnquiryFormIdentity('Wheel & Tyre Enquiry Form')?.formName).toBe('wheel_tyre')
    expect(resolveEnquiryFormIdentity('Paint and Panel Enquiry Form')?.formName).toBe('paint_panel')
  })

  it('resolves identity from CMS form_name first', () => {
    expect(
      resolveEnquiryFormIdentityFromForm({
        title: 'Unrelated Custom Title',
        form_name: 'sell_your_car',
      })?.formName,
    ).toBe('sell_your_car')

    expect(resolveEnquiryFormIdentityByFormName('new_vehicle_quote')?.department).toBe('sales')
    expect(resolveEnquiryFormIdentityByFormName('parts')?.department).toBe('parts')
    expect(resolveEnquiryFormIdentityByFormName('wheel_tyre')?.department).toBe('service')
  })

  it('returns display labels for CMS form_name values', () => {
    expect(getFormDisplayLabel('parts')).toBe('Parts')
    expect(getFormDisplayLabel('wheel_tyre')).toBe('Wheel & tyre')
    expect(getFormDisplayLabel(null)).toBeNull()
  })

  it('routes sales vs service thank-you paths from CMS form_name', () => {
    expect(
      getThankYouPathForForm({ title: 'Anything', form_name: 'general_enquiry' }),
    ).toBe('/sales-form-submitted')
    expect(
      getThankYouPathForForm({ title: 'Anything', form_name: 'wheel_tyre' }),
    ).toBe('/service-form-submitted')
  })

  it('routes sales vs service thank-you paths from title fallback', () => {
    expect(getThankYouPathForFormTitle('General Enquiry Form')).toBe('/sales-form-submitted')
    expect(getThankYouPathForFormTitle('Wheel & Tyre Enquiry Form')).toBe('/service-form-submitted')
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
