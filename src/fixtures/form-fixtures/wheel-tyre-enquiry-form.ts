import type { RequiredDataFromCollectionSlug } from 'payload'
import {
  DEPARTMENT_EMAILS,
  confirmationMessage,
  contactNamePhoneEmailFields,
  customerConfirmationEmail,
  departmentNotificationEmail,
  privacyPolicyField,
} from '@/fixtures/form-fixtures/formEmailHelpers'

export const wheelTyreEnquiryForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Wheel & Tyre Enquiry Form',
  formLayout: 'singlePage',
  confirmationType: 'message',
  confirmationMessage: confirmationMessage(
    'Enquiry Submitted',
    'Thank you for your enquiry. Our Wheel & Tyre team will be in touch with you shortly.',
  ),
  submitButtonLabel: 'Submit',
  lmsLeadInjection: {
    enabled: false,
  },
  emails: [
    customerConfirmationEmail({
      subject: 'Your wheel & tyre enquiry has been received — Eagle Ford',
      bodyLines: [
        'Hi {{firstName}},',
        'Thank you for your wheel & tyre enquiry. Our team will be in touch with you shortly.',
        'Kind regards,',
        'The Eagle Ford team',
      ],
    }),
    departmentNotificationEmail({
      emailTo: DEPARTMENT_EMAILS.wheelAndTyre,
      subject: 'Eagle Ford Wheel & Tyre Enquiry: {{firstName}} {{lastName}}',
      heading: 'Wheel & Tyre Enquiry',
      intro: 'A wheel & tyre enquiry was submitted on the Eagle Ford website.',
    }),
  ],
  fields: [
    ...contactNamePhoneEmailFields,
    {
      blockType: 'textarea',
      blockName: 'message',
      name: 'message',
      label: 'Question / Comment',
      required: false,
      width: 100,
    },
    privacyPolicyField,
  ],
}
