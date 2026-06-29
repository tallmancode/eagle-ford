import type { Block } from 'payload'

export const ContactInfoBlock: Block = {
  slug: 'contact-info',
  labels: {
    singular: 'Contact Info',
    plural: 'Contact Info',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Get in Touch',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email Address',
      required: true,
    },
    {
      name: 'addressLine1',
      type: 'text',
      label: 'Address Line 1',
      required: true,
    },
    {
      name: 'addressLine2',
      type: 'text',
      label: 'Address Line 2',
    },
    {
      name: 'businessHours',
      type: 'array',
      label: 'Business Hours',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Day / Range',
          required: true,
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Hours',
          required: true,
        },
      ],
    },
    {
      name: 'directionsUrl',
      type: 'text',
      label: 'Directions URL (Google Maps)',
    },
  ],
}
