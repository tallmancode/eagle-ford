import type { RequiredDataFromCollectionSlug } from 'payload'
import {
  DEPARTMENT_EMAILS,
  confirmationMessage,
  contactNamePhoneEmailFields,
  customerConfirmationEmail,
  departmentNotificationEmail,
  privacyPolicyField,
} from '@/fixtures/form-fixtures/formEmailHelpers'

/** Matches live General Enquiry Form LMS settings (CALLCENTRE). */
export const generalEnquiryForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'General Enquiry Form',
  formLayout: 'singlePage',
  confirmationType: 'message',
  confirmationMessage: confirmationMessage(
    'Enquiry Received',
    'Thank you for reaching out. A member of our team will be in touch with you shortly.',
  ),
  submitButtonLabel: 'Submit',
  lmsLeadInjection: {
    enabled: true,
    dealerRef: 'EC167',
    dealerFloor: 'CALLCENTRE',
    source: 'EAGLE-DEALERWEBSITE',
    defaultUsed: '0',
    defaultBrand: 'Ford',
    defaultModel: 'General Enquiry',
    commentsPrefix: 'General enquiry',
    fieldMappings: [{ formFieldName: 'message', lmsPath: 'seeks.comments' }],
  },
  emails: [
    customerConfirmationEmail({
      subject: 'Your enquiry has been received — Eagle Ford',
      bodyLines: [
        'Hi {{firstName}},',
        'Thank you for reaching out to Eagle Ford. We have received your enquiry and a member of our team will be in touch shortly.',
        'Questions? Call us on 010 440 0510.',
        'Kind regards,',
        'The Eagle Ford team',
      ],
    }),
    departmentNotificationEmail({
      emailTo: DEPARTMENT_EMAILS.sales,
      subject: 'Eagle Ford General Enquiry: {{firstName}} {{lastName}}',
      heading: 'General Enquiry',
      intro: 'A general enquiry was submitted on the Eagle Ford website.',
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
