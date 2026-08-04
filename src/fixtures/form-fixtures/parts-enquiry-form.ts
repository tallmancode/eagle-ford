import type { RequiredDataFromCollectionSlug } from 'payload'
import {
  DEPARTMENT_EMAILS,
  confirmationMessage,
  contactNamePhoneEmailFields,
  customerConfirmationEmail,
  departmentNotificationEmail,
  privacyPolicyField,
} from '@/fixtures/form-fixtures/formEmailHelpers'

export const partsEnquiryForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Parts Enquiry Form',
  formLayout: 'singlePage',
  confirmationType: 'message',
  confirmationMessage: confirmationMessage(
    'Enquiry Submitted',
    'Thank you for your enquiry. Our parts team will be in touch with you shortly.',
  ),
  submitButtonLabel: 'Submit',
  lmsLeadInjection: {
    enabled: false,
  },
  emails: [
    customerConfirmationEmail({
      subject: 'Your parts enquiry has been received — Eagle Ford',
      bodyLines: [
        'Hi {{firstName}},',
        'Thank you for your parts enquiry. Our parts team will be in touch with you shortly.',
        'Kind regards,',
        'The Eagle Ford team',
      ],
    }),
    departmentNotificationEmail({
      emailTo: DEPARTMENT_EMAILS.parts,
      subject: 'Eagle Ford Parts Enquiry: {{firstName}} {{lastName}}',
      heading: 'Parts Enquiry',
      intro: 'A parts enquiry was submitted on the Eagle Ford website.',
    }),
  ],
  fields: [
    ...contactNamePhoneEmailFields,
    {
      blockType: 'text',
      blockName: 'vin',
      name: 'vin',
      label: 'VIN Number',
      required: true,
      width: 50,
    },
    {
      blockType: 'textarea',
      blockName: 'description',
      name: 'description',
      label: 'Description of Part',
      required: false,
      width: 100,
    },
    privacyPolicyField,
  ],
}
