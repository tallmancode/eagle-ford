/** Mimecast-compatible From used across Eagle Ford form notifications. */
export const EAGLE_FORD_EMAIL_FROM = '"Eagle Ford" <noreply@eaglemc.co.za>'

export const DEPARTMENT_EMAILS = {
  sales: '"Sales" <sales@eagleford.co.za>',
  service: '"Service" <service@eagleford.co.za>',
  /** No public parts@ inbox — parts enquiries route with Service (workshop). */
  parts: '"Parts" <service@eagleford.co.za>',
  paintAndPanel: '"Paint and Panel" <paintandpanel@eaglemc.co.za>',
  wheelAndTyre: '"Wheel and Tyre" <wheelandtyre@eaglemc.co.za>',
} as const

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

export function paragraph(text: string, bold = false): RichTextParagraph {
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

export function confirmationMessage(heading: string, body: string) {
  return {
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
              text: heading,
              version: 1 as const,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0 as const,
          version: 1 as const,
        },
        paragraph(body),
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0 as const,
      version: 1 as const,
    },
  }
}

export function customerConfirmationEmail(options: {
  subject: string
  bodyLines: string[]
}) {
  return {
    emailFrom: EAGLE_FORD_EMAIL_FROM,
    emailTo: '{{email}}',
    subject: options.subject,
    message: {
      root: {
        type: 'root' as const,
        children: options.bodyLines.map((line) => paragraph(line)),
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0 as const,
        version: 1 as const,
      },
    },
  }
}

export function departmentNotificationEmail(options: {
  emailTo: string
  subject: string
  heading: string
  intro: string
}) {
  return {
    emailFrom: EAGLE_FORD_EMAIL_FROM,
    emailTo: options.emailTo,
    replyTo: '{{email}}',
    subject: options.subject,
    message: {
      root: {
        type: 'root' as const,
        children: [
          paragraph(options.heading, true),
          paragraph(options.intro),
          paragraph('Submission details:'),
          paragraph('{{*:table}}'),
          paragraph('Reply to the customer using the email/phone in the table above.'),
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0 as const,
        version: 1 as const,
      },
    },
  }
}

export const privacyPolicyField = {
  blockType: 'checkbox' as const,
  blockName: 'privacyPolicy',
  name: 'privacyPolicy',
  label: 'I have read and agree to the Eagle Ford (Pty) Ltd Privacy Policy',
  required: true,
  width: 100,
}

export const contactNamePhoneEmailFields = [
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
]
