import type { Endpoint, GlobalSlug, PayloadRequest } from 'payload'
import type { AiProviderSetting } from '@/payload-types'
import { extractContentFromDoc } from '@/plugins/ai-seo/utils/extractDocumentContent'
import { generateSEOMetadata } from '@/plugins/ai-seo/utils/aiGenerateText'
import type { ProviderConfig } from '@/plugins/ai-media-suggestions/types'

const PROVIDER_SETTINGS_SLUG = 'ai-provider-settings'

/**
 * Create the AI SEO generate endpoint
 */
export function createAISeoGenerateEndpoint(): Endpoint {
  return {
    path: '/ai-seo-generate',
    method: 'post',
    handler: async (req: PayloadRequest) => {
      try {
        if (!req.json) {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }

        const body = await req.json()
        const { doc, collectionSlug, globalSlug, promptOverride, target = 'seo', action } = body

        if (!doc || typeof doc !== 'object') {
          return Response.json({ error: 'Document data is required' }, { status: 400 })
        }

        const slug = collectionSlug || globalSlug
        if (!slug || typeof slug !== 'string') {
          return Response.json(
            { error: 'collectionSlug or globalSlug is required' },
            { status: 400 },
          )
        }

        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const extractedPrompt = extractContentFromDoc(doc, slug)

        // Extract-only action: return prompt for modal pre-fill
        if (action === 'extract') {
          return Response.json({ success: true, prompt: extractedPrompt })
        }

        let prompt: string
        if (typeof promptOverride === 'string' && promptOverride.trim()) {
          prompt = promptOverride.trim()
        } else {
          prompt = extractedPrompt
        }

        if (!prompt) {
          return Response.json(
            {
              error:
                'No content to generate from. Add page content or provide custom prompt in the modal.',
            },
            { status: 400 },
          )
        }

        let providerConfig: ProviderConfig

        try {
          const globalSettings = (await req.payload.findGlobal({
            slug: PROVIDER_SETTINGS_SLUG as GlobalSlug,
            depth: 1,
          })) as AiProviderSetting | null

          if (!globalSettings?.provider) {
            return Response.json(
              {
                error: 'AI provider not configured. Configure in Settings > AI Provider Settings.',
              },
              { status: 400 },
            )
          }

          const provider = globalSettings.provider
          const modelValue = globalSettings.model
          let modelId: string | undefined

          if (modelValue != null) {
            if (typeof modelValue === 'object' && modelValue !== null && 'modelId' in modelValue) {
              modelId = (modelValue as { modelId: string }).modelId
            } else if (typeof modelValue === 'string' || typeof modelValue === 'number') {
              const modelDoc = await req.payload.findByID({
                collection: 'ai-models',
                id: String(modelValue),
                depth: 0,
              })
              modelId = (modelDoc as { modelId?: string })?.modelId
            }
          }

          const apiKey = globalSettings.apiKey ?? undefined
          const apiUrl = globalSettings.apiUrl ?? undefined

          if (provider === 'ollama') {
            if (!apiUrl) {
              return Response.json(
                { error: 'Ollama API URL is required in provider settings' },
                { status: 400 },
              )
            }
            providerConfig = {
              provider: 'ollama',
              model: modelId || 'llama3.2',
              apiUrl,
              apiKey,
            }
          } else if (provider === 'ollama-cloud') {
            const cloudApiUrl = apiUrl || 'https://ollama.com'
            if (!apiKey) {
              return Response.json({ error: 'Ollama Cloud requires an API key' }, { status: 400 })
            }
            providerConfig = {
              provider: 'ollama-cloud',
              model: modelId || 'llama3.2',
              apiUrl: cloudApiUrl,
              apiKey,
            }
          } else if (provider === 'google-gemini') {
            if (!apiKey) {
              return Response.json({ error: 'Google Gemini API key is required' }, { status: 400 })
            }
            providerConfig = {
              provider: 'google-gemini',
              model: modelId || 'models/gemini-2.5-flash',
              apiKey,
              apiUrl,
            }
          } else if (provider === 'claude-api') {
            if (!apiKey) {
              return Response.json({ error: 'Claude API key is required' }, { status: 400 })
            }
            providerConfig = {
              provider: 'claude-api',
              model: modelId || 'claude-sonnet-4-5-20250929',
              apiKey,
            }
          } else {
            return Response.json({ error: `Unknown provider: ${provider}` }, { status: 400 })
          }
        } catch (error) {
          console.error('Failed to load provider config:', error)
          return Response.json(
            { error: 'Failed to load AI provider configuration' },
            { status: 500 },
          )
        }

        try {
          const result = await generateSEOMetadata(prompt, providerConfig)

          if (target === 'excerpt') {
            return Response.json({
              success: true,
              description: result.description,
            })
          }

          return Response.json({
            success: true,
            title: result.title,
            description: result.description,
          })
        } catch (error) {
          console.error('AI SEO generation error:', error)
          const message = error instanceof Error ? error.message : 'Unknown error'
          return Response.json(
            { error: 'Failed to generate SEO metadata', details: message },
            { status: 500 },
          )
        }
      } catch (error) {
        console.error('AI SEO generate endpoint error:', error)
        return Response.json({ error: 'An unexpected error occurred' }, { status: 500 })
      }
    },
  }
}
