import type { RequiredDataFromCollectionSlug } from 'payload'
import {
  DEPARTMENT_EMAILS,
  confirmationMessage,
  contactNamePhoneEmailFields,
  customerConfirmationEmail,
  departmentNotificationEmail,
  privacyPolicyField,
} from '@/fixtures/form-fixtures/formEmailHelpers'

export const paintPanelEnquiryForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Paint & Panel Enquiry Form',
  formLayout: 'singlePage',
  confirmationType: 'message',
  confirmationMessage: confirmationMessage(
    'Enquiry Submitted',
    'Thank you for your enquiry. Our paint & panel team will be in touch with you shortly.',
  ),
  submitButtonLabel: 'Submit Enquiry',
  lmsLeadInjection: {
    enabled: false,
  },
  emails: [
    customerConfirmationEmail({
      subject: 'Your paint & panel enquiry has been received — Eagle Ford',
      bodyLines: [
        'Hi {{firstName}},',
        'Thank you for your paint & panel enquiry. Our team will be in touch with you shortly.',
        'Kind regards,',
        'The Eagle Ford team',
      ],
    }),
    departmentNotificationEmail({
      emailTo: DEPARTMENT_EMAILS.paintAndPanel,
      subject: 'Eagle Ford Paint & Panel Enquiry: {{firstName}} {{lastName}}',
      heading: 'Paint & Panel Enquiry',
      intro: 'A paint & panel enquiry was submitted on the Eagle Ford website.',
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
