import type { RequiredDataFromCollectionSlug } from 'payload'
import {
  DEPARTMENT_EMAILS,
  confirmationMessage,
  contactNamePhoneEmailFields,
  customerConfirmationEmail,
  departmentNotificationEmail,
  privacyPolicyField,
} from '@/fixtures/form-fixtures/formEmailHelpers'

const FORD_TEST_DRIVE_MODELS = [
  'Everest',
  'Mustang',
  'Mustang Dark Horse',
  'Mustang GT',
  'New Level Territory',
  'New Tourneo Custom',
  'New Transit Custom',
  'Next Level Everest',
  'Next Level Ranger',
  'Ranger',
  'Ranger Platinum',
  'Ranger Raptor',
  'Ranger Single Cab',
  'Ranger Sport',
  'Ranger Super Cab',
  'Ranger Tremor',
  'Ranger Wildtrak',
  'Ranger Wildtrak X',
  'Ranger XL',
  'Ranger XLT',
  'Transit Van',
].map((model) => ({ label: model, value: model }))

/** Matches live Test Drive Booking Form LMS settings (NEWFORD). */
export const testDriveForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Test Drive Booking Form',
  formLayout: 'singlePage',
  confirmationType: 'message',
  confirmationMessage: confirmationMessage(
    'Test Drive Request Received',
    'Thank you! A member of our sales team will be in touch shortly to confirm your test drive appointment.',
  ),
  submitButtonLabel: 'Submit',
  lmsLeadInjection: {
    enabled: true,
    dealerRef: 'EC167',
    dealerFloor: 'NEWFORD',
    source: 'EAGLE-DEALERWEBSITE',
    defaultUsed: '0',
    defaultBrand: 'Ford',
    defaultModel: 'General Enquiry',
    commentsPrefix: 'Test drive booking',
    fieldMappings: [
      { formFieldName: 'model', lmsPath: 'seeks.model' },
      { formFieldName: 'message', lmsPath: 'seeks.comments' },
    ],
  },
  emails: [
    customerConfirmationEmail({
      subject: 'Your test drive request has been received — Eagle Ford',
      bodyLines: [
        'Hi {{firstName}},',
        'Thank you! A member of our sales team will be in touch shortly to confirm your test drive appointment.',
        'Kind regards,',
        'The Eagle Ford team',
      ],
    }),
    departmentNotificationEmail({
      emailTo: DEPARTMENT_EMAILS.sales,
      subject: 'Eagle Ford Test Drive: {{model}} — {{firstName}} {{lastName}}',
      heading: 'Test Drive Booking',
      intro: 'A test drive booking was submitted on the Eagle Ford website.',
    }),
  ],
  fields: [
    ...contactNamePhoneEmailFields,
    {
      blockType: 'date',
      blockName: 'preferredDate',
      name: 'preferredDate',
      label: 'Preferred Test Drive Date',
      required: true,
      width: 50,
    },
    {
      blockType: 'select',
      blockName: 'model',
      name: 'model',
      label: 'Model',
      placeholder: 'Select a Ford model',
      required: true,
      width: 100,
      options: FORD_TEST_DRIVE_MODELS,
    },
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
