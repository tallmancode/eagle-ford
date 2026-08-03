import type { RequiredDataFromCollectionSlug } from 'payload'
import { vehicleLmsSeedFields } from '@/fixtures/form-fixtures/vehicleLmsSeedFields'

type RichTextParagraph = {
  type: 'paragraph'
  children: Array<{
    type: 'text'
    detail: 0
    format: 0
    mode: 'normal'
    style: ''
    text: string
    version: 1
  }>
  direction: 'ltr'
  format: ''
  indent: 0
  textFormat: 0
  version: 1
}

function paragraph(text: string): RichTextParagraph {
  return {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    version: 1,
  }
}

const enquiryReceivedMessage = {
  root: {
    type: 'root' as const,
    children: [
      {
        type: 'heading' as const,
        tag: 'h2' as const,
        children: [
          {
            type: 'text' as const,
            detail: 0 as const,
            format: 0 as const,
            mode: 'normal' as const,
            style: '' as const,
            text: 'Enquiry Received',
            version: 1 as const,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0 as const,
        version: 1 as const,
      },
      paragraph(
        'Thank you for your interest. A member of our sales team will be in touch with you shortly.',
      ),
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0 as const,
    version: 1 as const,
  },
}

const contactAndConsentFields = [
  {
    blockType: 'text' as const,
    blockName: 'firstName',
    name: 'firstName',
    label: 'First Name',
    required: true,
    width: 50,
  },
  {
    blockType: 'text' as const,
    blockName: 'lastName',
    name: 'lastName',
    label: 'Last Name',
    required: true,
    width: 50,
  },
  {
    blockType: 'text' as const,
    blockName: 'phone',
    name: 'phone',
    label: 'Phone Number',
    required: true,
    width: 50,
  },
  {
    blockType: 'email' as const,
    blockName: 'email',
    name: 'email',
    label: 'Email Address',
    required: true,
    width: 50,
  },
  {
    blockType: 'textarea' as const,
    blockName: 'message',
    name: 'message',
    label: 'Question / Comment',
    required: false,
    width: 100,
  },
  {
    blockType: 'checkbox' as const,
    blockName: 'privacyPolicy',
    name: 'privacyPolicy',
    label: 'I have read and agree to the Eagle Ford (Pty) Ltd Privacy Policy',
    required: true,
    width: 100,
  },
]

export type VehicleQuoteFormOptions = {
  title: string
  salesIntro: string
  customerSubject: string
  salesSubject: string
  lms: {
    dealerFloor: string
    defaultUsed: '0' | '1'
    source?: string
    commentsPrefix?: string
  }
}

/**
 * Shared seed shape for Used / New vehicle quote forms, including LMS vehicle fields.
 */
export function buildVehicleQuoteForm(
  options: VehicleQuoteFormOptions,
): RequiredDataFromCollectionSlug<'forms'> {
  const source = options.lms.source ?? 'EAGLE-DEALERWEBSITE'

  return {
    title: options.title,
    formLayout: 'singlePage',
    confirmationType: 'message',
    confirmationMessage: enquiryReceivedMessage,
    submitButtonLabel: 'Submit Enquiry',
    lmsLeadInjection: {
      enabled: true,
      dealerRef: 'EC167',
      dealerFloor: options.lms.dealerFloor,
      source,
      defaultUsed: options.lms.defaultUsed,
      defaultBrand: 'Ford',
      defaultModel: 'General Enquiry',
      commentsPrefix: options.lms.commentsPrefix,
      fieldMappings: [],
    },
    emails: [
      {
        emailFrom: '"Eagle Ford" <noreply@eagleford.co.za>',
        emailTo: '{{email}}',
        subject: options.customerSubject,
        message: {
          root: {
            type: 'root',
            children: [
              paragraph('Eagle Ford'),
              paragraph('Hi {{firstName}},'),
              paragraph(
                'Thanks for your vehicle quote request with Eagle Ford. Our sales team has received your enquiry and will contact you shortly.',
              ),
              paragraph(
                'Questions? Call us on 010 440 0510. We are at 229 Corlett Dr, Bramley, Johannesburg, Gauteng, 2090. Hours: Mon-Fri 08h00-17h00, Sat 08h00-12h30.',
              ),
              paragraph('Kind regards,'),
              paragraph('The Eagle Ford team'),
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      {
        emailFrom: '"Eagle Ford" <noreply@eagleford.co.za>',
        emailTo: 'sales@eagleford.co.za',
        replyTo: '{{email}}',
        subject: options.salesSubject,
        message: {
          root: {
            type: 'root',
            children: [
              paragraph(options.salesIntro),
              paragraph('Vehicle: {{vehicleName}}'),
              paragraph('Name: {{firstName}} {{lastName}}'),
              paragraph('Phone: {{phone}}'),
              paragraph('Email: {{email}}'),
              paragraph('Message: {{message}}'),
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    ],
    fields: [...vehicleLmsSeedFields, ...contactAndConsentFields],
  }
}

/** Thank-you page slug used by live Used/New vehicle quote forms. */
export const VEHICLE_QUOTE_THANK_YOU_SLUG = 'sales-form-submitted'
