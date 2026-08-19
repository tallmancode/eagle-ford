import type { CollectionConfig } from 'payload'

import { isDeveloper } from '@/lib/utils/accessUtil'

export const AiSeoUsageCollection: CollectionConfig<'ai-seo-usage'> = {
  slug: 'ai-seo-usage',
  labels: {
    singular: 'AI SEO usage',
    plural: 'AI SEO usage',
  },
  admin: {
    group: 'Settings',
    useAsTitle: 'slug',
    defaultColumns: [
      'createdAt',
      'slug',
      'status',
      'inputTokens',
      'outputTokens',
      'estimatedCostUsd',
    ],
    description: 'Token usage for AI-generated SEO titles and descriptions. Developers only.',
    hidden: ({ user }) => {
      const roles = user && 'roles' in user ? user.roles : null
      return !Array.isArray(roles) || !roles.includes('developer')
    },
  },
  access: {
    create: () => false,
    read: isDeveloper,
    update: () => false,
    delete: isDeveloper,
  },
  fields: [
    {
      name: 'collectionSlug',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'docId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Fallback', value: 'fallback' },
        { label: 'Error', value: 'error' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'model',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'inputTokens',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'outputTokens',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'estimatedCostUsd',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Estimated from a local rate table, not billed usage from Anthropic.',
      },
    },
    {
      name: 'errorCode',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
