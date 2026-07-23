import type { Endpoint, GlobalSlug, PayloadRequest } from 'payload'
import type { AiProviderSetting } from '@/payload-types'
import type { ResolvedPluginConfig } from '../types'

interface GoogleModelInfo {
  name?: string
  displayName?: string
  supportedGenerationMethods?: string[]
}

interface OllamaModelResponse {
  models?: { name: string }[]
}

/**
 * Fetch models from provider APIs and store them in the ai-models collection.
 * Replaces existing models for the selected provider.
 */
export function createRefetchModelsEndpoint(config: ResolvedPluginConfig): Endpoint {
  return {
    path: `${config.endpointPath}/refetch-models`,
    method: 'post',
    handler: async (req: PayloadRequest) => {
      try {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const globalSettings = (await req.payload.findGlobal({
          slug: config.providerSettingsSlug as GlobalSlug,
          depth: 0,
        })) as AiProviderSetting | null

        if (!globalSettings?.provider) {
          return Response.json(
            { error: 'No provider selected. Select a provider in AI Provider Settings first.' },
            { status: 400 },
          )
        }

        const provider = globalSettings.provider
        const apiUrl = globalSettings.apiUrl ?? undefined
        const apiKey = globalSettings.apiKey ?? undefined

        let modelEntries: { modelId: string; displayName: string }[] = []

        if (provider === 'ollama') {
          const baseUrl = (apiUrl || 'http://localhost:11434')
            .replace(/\/api\/?$/, '')
            .replace(/\/$/, '')
          const tagsUrl = `${baseUrl}/api/tags`

          const headers: Record<string, string> = { 'Content-Type': 'application/json' }
          if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`

          const response = await fetch(tagsUrl, { method: 'GET', headers })
          if (!response.ok) {
            const errorText = await response.text()
            return Response.json(
              {
                error: 'Failed to fetch Ollama models',
                details: `API returned ${response.status}: ${errorText}`,
                hint: 'Ensure Ollama is running and the API URL is correct.',
              },
              { status: 500 },
            )
          }

          const data = (await response.json()) as OllamaModelResponse
          const models = data.models ?? []
          modelEntries = models.map((m) => ({
            modelId: m.name,
            displayName: m.name,
          }))
        } else if (provider === 'ollama-cloud') {
          const baseUrl = (apiUrl || 'https://ollama.com')
            .replace(/\/api\/?$/, '')
            .replace(/\/$/, '')
          const tagsUrl = `${baseUrl}/api/tags`

          if (!apiKey) {
            return Response.json(
              { error: 'Ollama Cloud requires an API key. Configure it in AI Provider Settings.' },
              { status: 400 },
            )
          }

          const response = await fetch(tagsUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          })
          if (!response.ok) {
            const errorText = await response.text()
            return Response.json(
              {
                error: 'Failed to fetch Ollama Cloud models',
                details: `API returned ${response.status}: ${errorText}`,
                hint: 'Verify your API key at https://ollama.com',
              },
              { status: 500 },
            )
          }

          const data = (await response.json()) as OllamaModelResponse
          const models = data.models ?? []
          modelEntries = models.map((m) => ({
            modelId: m.name,
            displayName: m.name,
          }))
        } else if (provider === 'google-gemini') {
          if (!apiKey) {
            return Response.json(
              { error: 'Google Gemini requires an API key. Configure it in AI Provider Settings.' },
              { status: 400 },
            )
          }

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
            { method: 'GET', headers: { 'Content-Type': 'application/json' } },
          )
          if (!response.ok) {
            const errorText = await response.text()
            return Response.json(
              {
                error: 'Failed to fetch Google Gemini models',
                details: `API returned ${response.status}: ${errorText}`,
                hint: 'Verify your API key at https://aistudio.google.com/app/apikey',
              },
              { status: 500 },
            )
          }

          const data = (await response.json()) as { models?: GoogleModelInfo[] }
          const models = data.models ?? []
          const visionModels = models.filter(
            (m: GoogleModelInfo) =>
              m.supportedGenerationMethods?.includes('generateContent') &&
              m.name &&
              (m.name.includes('vision') || m.name.includes('gemini')),
          )
          modelEntries = visionModels.map((m: GoogleModelInfo) => ({
            modelId: m.name!,
            displayName: m.displayName || m.name || m.name!,
          }))
        } else if (provider === 'claude-api') {
          if (!apiKey) {
            return Response.json(
              { error: 'Claude API requires an API key. Configure it in AI Provider Settings.' },
              { status: 400 },
            )
          }

          const response = await fetch('https://api.anthropic.com/v1/models?limit=1000', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
            },
          })
          if (!response.ok) {
            const errorText = await response.text()
            return Response.json(
              {
                error: 'Failed to fetch Claude API models',
                details: `API returned ${response.status}: ${errorText}`,
                hint: 'Verify your API key at https://console.anthropic.com/',
              },
              { status: 500 },
            )
          }

          const data = (await response.json()) as { data?: { id: string; display_name?: string }[] }
          const models = data.data ?? []
          modelEntries = models.map((m) => ({
            modelId: m.id,
            displayName: m.display_name || m.id,
          }))
        } else {
          return Response.json({ error: `Unknown provider: ${provider}` }, { status: 400 })
        }

        if (modelEntries.length === 0) {
          return Response.json(
            {
              success: true,
              message: 'No models found for this provider.',
              count: 0,
            },
            { status: 200 },
          )
        }

        await req.payload.delete({
          collection: 'ai-models',
          where: { provider: { equals: provider } },
          req,
        })

        for (const entry of modelEntries) {
          await req.payload.create({
            collection: 'ai-models',
            data: {
              provider,
              modelId: entry.modelId,
              displayName: entry.displayName || entry.modelId,
            },
            req,
          })
        }

        return Response.json({
          success: true,
          message: `Fetched ${modelEntries.length} model(s) for ${provider}.`,
          count: modelEntries.length,
        })
      } catch (error) {
        console.error('Refetch models error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return Response.json(
          { error: 'Failed to refetch models', details: errorMessage },
          { status: 500 },
        )
      }
    },
  }
}
