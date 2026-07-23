import type { GlobalConfig, Where } from 'payload'
import { isAdmin, isAnyone } from '@/lib/utils/accessUtil'

export const AIProviderSettings: GlobalConfig = {
  slug: 'ai-provider-settings',
  access: {
    read: isAnyone,
    update: isAdmin,
  },
  admin: {
    group: 'Settings',
    description: 'Configure AI provider settings for media suggestions',
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        const model = doc?.model
        if (model != null && typeof model === 'string') {
          if (model.includes('/') || model.includes(':') || !/^[a-f0-9]{24}$/i.test(model)) {
            doc.model = null
          }
        }
        return doc
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data?.provider && originalDoc?.provider && data.provider !== originalDoc.provider) {
          data.model = undefined
        }
        if (data?.model != null && typeof data.model === 'string') {
          if (
            data.model.includes('/') ||
            data.model.includes(':') ||
            !/^[a-f0-9]{24}$/i.test(data.model)
          ) {
            data.model = undefined
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      required: true,
      defaultValue: 'ollama',
      options: [
        {
          label: 'Ollama (Local/Self-hosted)',
          value: 'ollama',
        },
        {
          label: 'Ollama (Cloud - ollama.com)',
          value: 'ollama-cloud',
        },
        {
          label: 'Google Gemini Vision',
          value: 'google-gemini',
        },
        {
          label: 'Claude (Anthropic API)',
          value: 'claude-api',
        },
      ],
      admin: {
        description: 'Select the AI vision provider to use for generating media suggestions',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'model',
          type: 'relationship',
          relationTo: 'ai-models',
          required: false,
          filterOptions: ({ siblingData }): Where => {
            const provider = (siblingData as { provider?: string })?.provider
            if (!provider) return { id: { in: [] } }
            return { provider: { equals: provider } }
          },
          admin: {
            description:
              "Select from cached models. Use 'Refetch models' if the list is empty or outdated.",
            width: '85%',
            condition: (data) => Boolean(data.provider),
          },
        },
        {
          name: 'refetchModels',
          type: 'ui',
          admin: {
            components: {
              Field: {
                path: '@/plugins/ai-media-suggestions/components/RefetchModelsButton',
                exportName: 'RefetchModelsButton',
              },
            },
            width: '15%',
            condition: (data) => Boolean(data.provider),
          },
        },
      ],
    },

    {
      name: 'apiUrl',
      type: 'text',
      admin: {
        description:
          'API endpoint URL - Ollama Local: http://localhost:11434 | Ollama Cloud: https://ollama.com (default)',
        condition: (data) => data.provider === 'ollama' || data.provider === 'ollama-cloud',
      },
    },
    {
      name: 'apiKey',
      type: 'text',
      admin: {
        description:
          'API key - Optional for Ollama Local | Required for Ollama Cloud, Google Gemini, and Claude API (console.anthropic.com)',
        condition: (data) => Boolean(data.provider),
        components: {
          Field: {
            path: '@/plugins/ai-media-suggestions/components/RedactedApiKeyField',
            exportName: 'RedactedApiKeyField',
          },
        },
      },
    },
    {
      name: 'testProvider',
      type: 'ui',
      admin: {
        components: {
          Field: {
            path: '@/plugins/ai-media-suggestions/components/TestProviderButton',
            exportName: 'TestProviderButton',
          },
        },
        condition: (data) => Boolean(data.provider),
      },
    },
  ],
}
