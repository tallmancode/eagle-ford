import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated } from '@/lib/utils/accessUtil'

export const AIModelsCollection: CollectionConfig = {
  slug: 'ai-models',
  admin: {
    hidden: true,
    useAsTitle: 'displayName',
  },
  access: {
    create: isAdmin,
    read: isAuthenticated,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Ollama (Local)', value: 'ollama' },
        { label: 'Ollama Cloud', value: 'ollama-cloud' },
        { label: 'Google Gemini', value: 'google-gemini' },
        { label: 'Claude API', value: 'claude-api' },
      ],
    },
    {
      name: 'modelId',
      type: 'text',
      required: true,
      admin: {
        description: 'API identifier (e.g. llava:latest, models/gemini-2.5-flash)',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      admin: {
        description: 'Human-readable label for the dropdown',
      },
    },
  ],
  timestamps: true,
}
