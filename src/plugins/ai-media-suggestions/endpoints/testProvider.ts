import type { Endpoint, PayloadRequest } from 'payload'
import type { ResolvedPluginConfig, ProviderConfig } from '../types'
import { generateMediaSuggestions } from '../utils/generateSuggestions'

/**
 * Create an endpoint to test provider configuration
 * This allows users to validate their settings before using them
 */
export function createTestProviderEndpoint(config: ResolvedPluginConfig): Endpoint {
  return {
    path: `${config.endpointPath}/test-provider`,
    method: 'post',
    handler: async (req: PayloadRequest) => {
      try {
        // Check if user is authenticated
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse request body
        if (!req.json) {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }
        const body = await req.json()
        const { provider, model: modelInput, apiUrl, apiKey } = body

        if (!provider || modelInput == null || modelInput === '') {
          return Response.json({ error: 'Provider and model are required' }, { status: 400 })
        }

        // Resolve modelId: modelInput can be relationship id (fetch AIModel) or legacy modelId string
        let modelId: string
        if (
          typeof modelInput === 'string' &&
          (modelInput.includes(':') || modelInput.includes('/'))
        ) {
          modelId = modelInput
        } else {
          try {
            const modelDoc = await req.payload.findByID({
              collection: 'ai-models',
              id: modelInput,
              depth: 0,
            })
            modelId = (modelDoc as { modelId?: string })?.modelId ?? String(modelInput)
          } catch {
            modelId = String(modelInput)
          }
        }

        // Build provider config
        let providerConfig: ProviderConfig

        if (provider === 'ollama' || provider === 'ollama-cloud') {
          const resolvedApiUrl =
            apiUrl || (provider === 'ollama-cloud' ? 'https://ollama.com' : undefined)

          if (!resolvedApiUrl) {
            return Response.json({ error: 'API URL is required for Ollama' }, { status: 400 })
          }

          if (provider === 'ollama-cloud' && !apiKey) {
            return Response.json({ error: 'API key is required for Ollama Cloud' }, { status: 400 })
          }

          providerConfig = {
            provider,
            model: modelId,
            apiUrl: resolvedApiUrl,
            apiKey,
          }
        } else if (provider === 'google-gemini') {
          if (!apiKey) {
            return Response.json(
              { error: 'API key is required for Google Gemini' },
              { status: 400 },
            )
          }

          providerConfig = {
            provider: 'google-gemini',
            model: modelId,
            apiKey,
            apiUrl,
          }
        } else if (provider === 'claude-api') {
          if (!apiKey) {
            return Response.json({ error: 'API key is required for Claude API' }, { status: 400 })
          }

          providerConfig = {
            provider: 'claude-api',
            model: modelId,
            apiKey,
          }
        } else {
          return Response.json({ error: `Unknown provider: ${provider}` }, { status: 400 })
        }

        // Create a small test image (1x1 pixel white PNG)
        const testImageBase64 =
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
        const testImageBuffer = Buffer.from(testImageBase64, 'base64')

        // Test the provider with a simple request
        const result = await generateMediaSuggestions(
          testImageBuffer,
          'image/png',
          providerConfig,
          'This is a test image to verify provider configuration.',
        )

        return Response.json({
          success: true,
          message: 'Provider configuration is working correctly!',
          testResult: {
            title: result.title,
            alt: result.alt,
            credits: result.credits,
          },
          provider,
          model: modelId,
        })
      } catch (error) {
        console.error('Provider test error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        return Response.json(
          {
            success: false,
            error: 'Provider test failed',
            details: errorMessage,
          },
          { status: 500 },
        )
      }
    },
  }
}
