import type { RequiredDataFromCollectionSlug } from 'payload'
import {
  DEPARTMENT_EMAILS,
  confirmationMessage,
  contactNamePhoneEmailFields,
  customerConfirmationEmail,
  departmentNotificationEmail,
  privacyPolicyField,
} from '@/fixtures/form-fixtures/formEmailHelpers'

/**
 * Special offer / vehicle-related LMS form.
 * Hidden context fields are filled from the specials page (vehicleName, modelName, etc.).
 */
export const specialOfferEnquiryForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Special Offer Enquiry Form',
  formLayout: 'singlePage',
  confirmationType: 'message',
  confirmationMessage: confirmationMessage(
    'Enquiry Received',
    'Thank you for your interest in our special offer. A member of our team will be in touch with you shortly.',
  ),
  submitButtonLabel: 'Submit Enquiry',
  lmsLeadInjection: {
    enabled: true,
    dealerRef: 'EC167',
    dealerFloor: 'NEWFORD',
    source: 'EAGLE-DEALERWEBSITE',
    defaultUsed: '0',
    defaultBrand: 'Ford',
    defaultModel: 'General Enquiry',
    commentsPrefix: 'Special offer enquiry',
    fieldMappings: [
      { formFieldName: 'modelName', lmsPath: 'seeks.model' },
      { formFieldName: 'vehicleName', lmsPath: 'seeks.modelrange' },
      { formFieldName: 'message', lmsPath: 'seeks.comments' },
    ],
  },
  emails: [
    customerConfirmationEmail({
      subject: 'Your special offer enquiry has been received — Eagle Ford',
      bodyLines: [
        'Hi {{firstName}},',
        'Thank you for your interest in our special offer. A member of our team will be in touch with you shortly.',
        'Kind regards,',
        'The Eagle Ford team',
      ],
    }),
    departmentNotificationEmail({
      emailTo: DEPARTMENT_EMAILS.sales,
      subject: 'Eagle Ford Special Offer Enquiry: {{specialTitle}} — {{firstName}} {{lastName}}',
      heading: 'Special Offer Enquiry',
      intro: 'A special offer enquiry was submitted on the Eagle Ford website.',
    }),
  ],
  fields: [
    {
      blockType: 'text',
      blockName: 'vehicleName',
      name: 'vehicleName',
      label: 'Vehicle',
      required: false,
      width: 50,
      hidden: true,
    },
    {
      blockType: 'text',
      blockName: 'specialCategory',
      name: 'specialCategory',
      label: 'Special Category',
      required: false,
      width: 50,
      hidden: true,
    },
    {
      blockType: 'text',
      blockName: 'modelName',
      name: 'modelName',
      label: 'Model',
      required: false,
      width: 50,
      hidden: true,
    },
    {
      blockType: 'text',
      blockName: 'specialType',
      name: 'specialType',
      label: 'Special Type',
      required: false,
      width: 50,
      hidden: true,
    },
    {
      blockType: 'text',
      blockName: 'specialTitle',
      name: 'specialTitle',
      label: 'Special Offer',
      required: false,
      width: 50,
      hidden: true,
    },
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
