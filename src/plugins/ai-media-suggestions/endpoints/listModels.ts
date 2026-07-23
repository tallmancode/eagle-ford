import type { Endpoint, GlobalSlug, PayloadRequest } from 'payload'
import type { AiProviderSetting } from '@/payload-types'
import type { ResolvedPluginConfig } from '../types'

interface GoogleModelInfo {
  name?: string
  displayName?: string
  description?: string
  supportedGenerationMethods?: string[]
  inputTokenLimit?: number
  outputTokenLimit?: number
}

/**
 * Create an endpoint to list available Google Gemini models
 * This helps diagnose API key and model availability issues
 */
export function createListModelsEndpoint(config: ResolvedPluginConfig): Endpoint {
  return {
    path: `${config.endpointPath}/list-models`,
    method: 'get',
    handler: async (req: PayloadRequest) => {
      try {
        // Check if user is authenticated
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch provider settings from global collection
        let apiKey: string | undefined

        try {
          const globalSettings = (await req.payload.findGlobal({
            slug: config.providerSettingsSlug as GlobalSlug,
            depth: 0,
          })) as AiProviderSetting | null

          if (globalSettings?.provider === 'google-gemini') {
            apiKey = globalSettings.apiKey ?? undefined
          }
        } catch (_error) {
          // Ignore error, we'll check for API key below
        }

        if (!apiKey) {
          return Response.json(
            {
              error: 'No Google Gemini API key configured',
              hint: 'Configure your API key in Settings → AI Provider Settings',
            },
            { status: 400 },
          )
        }

        // Call the REST API directly to list models
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (!response.ok) {
          const errorText = await response.text()
          return Response.json(
            {
              error: 'Failed to list models',
              details: `API returned ${response.status}: ${errorText}`,
              hint: 'Verify your API key is valid at https://aistudio.google.com/app/apikey',
              apiKeyTested: true,
            },
            { status: 500 },
          )
        }

        const data = (await response.json()) as { models?: GoogleModelInfo[] }
        const models = data.models ?? []

        // Filter for models that support generateContent (vision models)
        const visionModels = models.filter(
          (model: GoogleModelInfo) =>
            model.supportedGenerationMethods?.includes('generateContent') &&
            model.name &&
            (model.name.includes('vision') || model.name.includes('gemini')),
        )

        return Response.json({
          success: true,
          apiKeyValid: true,
          totalModels: models.length,
          visionModelsCount: visionModels.length,
          recommendedModels: visionModels
            .filter(
              (m: GoogleModelInfo) =>
                m.name?.includes('1.5-flash') ||
                m.name?.includes('1.5-pro') ||
                m.name?.includes('pro-vision'),
            )
            .map((model: GoogleModelInfo) => ({
              name: model.name,
              displayName: model.displayName,
              description: model.description,
              supportedMethods: model.supportedGenerationMethods,
              inputTokenLimit: model.inputTokenLimit,
              outputTokenLimit: model.outputTokenLimit,
            })),
          allVisionModels: visionModels.map((model: GoogleModelInfo) => ({
            name: model.name,
            displayName: model.displayName,
            supportedMethods: model.supportedGenerationMethods,
          })),
          allModels: models.map((model: GoogleModelInfo) => model.name),
        })
      } catch (error) {
        console.error('Error listing models:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        return Response.json(
          {
            error: 'Failed to list models',
            details: errorMessage,
            hint: 'Verify your API key is valid at https://aistudio.google.com/app/apikey',
            apiKeyTested: true,
          },
          { status: 500 },
        )
      }
    },
  }
}
