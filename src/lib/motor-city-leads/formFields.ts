import type { Field } from 'payload'

import {
  LMS_DEFAULT_BRAND,
  LMS_DEFAULT_DEALER_FLOOR,
  LMS_DEFAULT_MODEL,
  LMS_DEFAULT_SOURCE,
  LMS_DEFAULT_USED,
} from '@/lib/motor-city-leads/constants'
import { LMS_FIELD_PATH_OPTIONS } from '@/lib/motor-city-leads/lmsFieldPaths'

/**
 * Opt-in CMS LMS lead settings on the Payload `forms` collection.
 * When enabled, submissions are posted to Eagle Motor City (not CMS LMS directly).
 */
export function getLmsLeadInjectionFields(): Field {
  return {
    name: 'lmsLeadInjection',
    type: 'group',
    label: 'CMS LMS Lead Injection',
    admin: {
      description:
        'Opt-in only. When enabled, this form’s submissions are sent to Eagle Motor City, which forwards them to CMS LMS. Other forms are unaffected.',
    },
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        defaultValue: false,
        label: 'LMS Push',
        admin: {
          description:
            'Send submissions to CMS LMS via Motor City. Off by default — enable only for forms that should create LMS leads.',
        },
      },
      {
        type: 'row',
        admin: {
          condition: (_: unknown, siblingData: { enabled?: boolean }) =>
            Boolean(siblingData?.enabled),
        },
        fields: [
          {
            name: 'dealerRef',
            type: 'text',
            defaultValue: 'EC167',
            admin: {
              width: '33%',
              description:
                'CMS dealer code (must match CMS LMS). Required when injection is enabled.',
            },
          },
          {
            name: 'dealerFloor',
            type: 'text',
            defaultValue: LMS_DEFAULT_DEALER_FLOOR,
            admin: {
              width: '33%',
              description:
                'CMS floor code (e.g. NEWFORD, USED, CALLCENTRE). Required when injection is enabled.',
            },
          },
          {
            name: 'source',
            type: 'text',
            defaultValue: LMS_DEFAULT_SOURCE,
            admin: {
              width: '33%',
              description:
                'CMS lead source code (validated by CMS). Required when injection is enabled.',
            },
          },
        ],
      },
      {
        type: 'collapsible',
        label: 'Vehicle defaults',
        admin: {
          condition: (_: unknown, siblingData: { enabled?: boolean }) =>
            Boolean(siblingData?.enabled),
          initCollapsed: true,
        },
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'defaultUsed',
                type: 'select',
                defaultValue: LMS_DEFAULT_USED,
                options: [
                  { label: 'New (0)', value: '0' },
                  { label: 'Used (1)', value: '1' },
                ],
                admin: { width: '33%' },
              },
              {
                name: 'defaultBrand',
                type: 'text',
                defaultValue: LMS_DEFAULT_BRAND,
                admin: { width: '33%' },
              },
              {
                name: 'defaultModel',
                type: 'text',
                defaultValue: LMS_DEFAULT_MODEL,
                admin: { width: '33%' },
              },
            ],
          },
          {
            name: 'commentsPrefix',
            type: 'text',
            admin: {
              description: 'Optional text prepended to seeks.comments',
            },
          },
        ],
      },
      {
        name: 'fieldMappings',
        type: 'array',
        labels: {
          singular: 'Field Mapping',
          plural: 'Field Mappings',
        },
        admin: {
          condition: (_: unknown, siblingData: { enabled?: boolean }) =>
            Boolean(siblingData?.enabled),
          description:
            'Map form field names to LMS paths. Common names (firstName, lastName, phone, email, model, message) are auto-mapped when omitted.',
        },
        fields: [
          {
            name: 'formFieldName',
            type: 'text',
            required: true,
            admin: {
              description: 'Form field `name` (case-insensitive)',
            },
          },
          {
            name: 'lmsPath',
            type: 'select',
            required: true,
            options: LMS_FIELD_PATH_OPTIONS,
          },
        ],
      },
    ],
  }
}
