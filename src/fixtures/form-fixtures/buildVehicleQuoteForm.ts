import type { RequiredDataFromCollectionSlug } from 'payload'
import { vehicleLmsSeedFields } from '@/fixtures/form-fixtures/vehicleLmsSeedFields'

type RichTextParagraph = {
  type: 'paragraph'
  children: Array<{
    type: 'text'
    detail: 0
    format: 0 | 1
    mode: 'normal'
    style: ''
    text: string
    version: 1
  }>
  direction: 'ltr'
  format: ''
  indent: 0
  textFormat: 0 | 1
  version: 1
}

function paragraph(text: string, bold = false): RichTextParagraph {
  const format = bold ? 1 : 0
  return {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        detail: 0,
        format,
        mode: 'normal',
        style: '',
        text,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: format,
    version: 1,
  }
}

/** Explicit LMS mappings from the live Used Vehicle Quote form. */
const vehicleQuoteLmsFieldMappings = [
  { formFieldName: 'brand', lmsPath: 'seeks.brand' as const },
  { formFieldName: 'model', lmsPath: 'seeks.model' as const },
  { formFieldName: 'modelRange', lmsPath: 'seeks.modelrange' as const },
  { formFieldName: 'year', lmsPath: 'seeks.year' as const },
  { formFieldName: 'mileage', lmsPath: 'seeks.kms' as const },
  { formFieldName: 'stockNumber', lmsPath: 'seeks.stockNr' as const },
  { formFieldName: 'mmCode', lmsPath: 'seeks.mmCode' as const },
  { formFieldName: 'colour', lmsPath: 'seeks.colour' as const },
  { formFieldName: 'price', lmsPath: 'seeks.price' as const },
  { formFieldName: 'vin', lmsPath: 'seeks.vin' as const },
  { formFieldName: 'regNo', lmsPath: 'seeks.regno' as const },
  { formFieldName: 'message', lmsPath: 'seeks.comments' as const },
]

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
  /** Bold heading in the sales notification email. */
  salesEmailHeading: string
  /** Intro line under the sales email heading. */
  salesEmailIntro: string
  salesSubject: string
  lms: {
    dealerFloor: string
    defaultUsed: '0' | '1'
    source?: string
    commentsPrefix: string
  }
}

/**
 * Shared seed shape for Used / New vehicle quote forms.
 * Pattern matches the live Used Vehicle Quote form (emails + LMS mappings);
 * wrappers supply used vs new floor / copy.
 */
export function buildVehicleQuoteForm(
  options: VehicleQuoteFormOptions,
): RequiredDataFromCollectionSlug<'forms'> {
  const source = options.lms.source ?? 'EAGLE-DEALERWEBSITE'
  const emailFrom = '"Eagle Ford" <noreply@eaglemc.co.za>'

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
      fieldMappings: vehicleQuoteLmsFieldMappings,
    },
    emails: [
      {
        emailFrom,
        emailTo: '{{email}}',
        subject: 'Your vehicle quote request - Eagle Ford',
        message: {
          root: {
            type: 'root',
            children: [
              paragraph('Eagle Ford'),
              paragraph('Hi {{firstName}},'),
              paragraph('Thanks for requesting a quote from Eagle Ford.'),
              paragraph(
                'Our sales team has received your details and will follow up with pricing, stock availability, and finance options where relevant.',
              ),
              paragraph(
                'If you have a preferred model or trade-in in mind, mention it when we call — it helps us prepare a clearer offer.',
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
        emailFrom,
        emailTo: 'sales@eagleford.co.za',
        replyTo: '{{email}}',
        subject: options.salesSubject,
        message: {
          root: {
            type: 'root',
            children: [
              paragraph(options.salesEmailHeading, true),
              paragraph(options.salesEmailIntro),
              paragraph('Submission details:'),
              paragraph('{{*:table}}'),
              paragraph('Reply to the customer using the email/phone in the table above.'),
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
