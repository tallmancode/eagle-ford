import type { Endpoint, GlobalSlug, PayloadRequest } from 'payload'
import type { AiProviderSetting, Media } from '@/payload-types'
import { generateMediaSuggestions } from '../utils/generateSuggestions'
import type { ResolvedPluginConfig, ProviderConfig } from '../types'
import fs from 'fs/promises'
import path from 'path'

/**
 * Create the AI suggestions endpoint
 */
export function createAISuggestionsEndpoint(config: ResolvedPluginConfig): Endpoint {
  return {
    path: config.endpointPath,
    method: 'post',
    handler: async (req: PayloadRequest) => {
      try {
        // Parse request body
        if (!req.json) {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }
        const body = await req.json()
        const { mediaId, imageUrl, base64Image, mimeType, context } = body

        if (!mediaId && !imageUrl && !base64Image) {
          return Response.json(
            { error: 'Either mediaId, imageUrl, or base64Image is required' },
            { status: 400 },
          )
        }

        // Check if user is authenticated
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let imageBuffer: Buffer
        let imageMimeType: string

        if (base64Image) {
          // New flow: Use base64 image directly from client
          imageBuffer = Buffer.from(base64Image, 'base64')
          imageMimeType = mimeType || 'image/jpeg'
        } else if (mediaId) {
          // Existing flow: Fetch saved media document
          let mediaDoc: Media
          try {
            mediaDoc = await req.payload.findByID({
              collection: 'media',
              id: mediaId,
              user: req.user,
              overrideAccess: false, // Enforce access control
            })
          } catch (_error) {
            return Response.json({ error: 'Media not found or access denied' }, { status: 404 })
          }

          // Check if the media has a filename
          if (!mediaDoc.filename) {
            return Response.json({ error: 'Media file not found' }, { status: 400 })
          }

          // Construct the file path
          const uploadsDir = path.resolve(process.cwd(), 'public/media/uploads')
          const filePath = path.join(uploadsDir, mediaDoc.filename)

          // Read the file
          try {
            imageBuffer = await fs.readFile(filePath)
          } catch (error) {
            console.error('Error reading file:', error)
            return Response.json({ error: 'Failed to read media file' }, { status: 500 })
          }

          imageMimeType = mediaDoc.mimeType || 'image/jpeg'
        } else if (imageUrl) {
          // Fallback flow: Fetch from URL
          try {
            // Fetch the image from the URL
            const imageResponse = await fetch(imageUrl)
            if (!imageResponse.ok) {
              return Response.json({ error: 'Failed to fetch image' }, { status: 500 })
            }

            // Convert response to buffer
            const arrayBuffer = await imageResponse.arrayBuffer()
            imageBuffer = Buffer.from(arrayBuffer)

            // Get MIME type from response
            imageMimeType = imageResponse.headers.get('content-type') || 'image/jpeg'
          } catch (error) {
            console.error('Error fetching image from URL:', error)
            return Response.json({ error: 'Failed to fetch image from URL' }, { status: 500 })
          }
        } else {
          return Response.json({ error: 'Invalid request' }, { status: 400 })
        }

        // Validate that it's an image
        if (!imageMimeType.startsWith('image/')) {
          return Response.json({ error: 'Only image files are supported' }, { status: 400 })
        }

        // Fetch provider settings from global collection (with fallback to plugin config)
        let providerConfig: ProviderConfig

        try {
          // Try to fetch global provider settings (depth 1 to populate model relationship)
          const globalSettings = (await req.payload.findGlobal({
            slug: config.providerSettingsSlug as GlobalSlug,
            depth: 1,
          })) as AiProviderSetting | null

          if (globalSettings?.provider) {
            // Use global settings
            const provider = globalSettings.provider
            const modelValue = globalSettings.model
            let modelId: string | undefined
            if (modelValue != null) {
              if (
                typeof modelValue === 'object' &&
                modelValue !== null &&
                'modelId' in modelValue
              ) {
                modelId = (modelValue as { modelId: string }).modelId
              } else if (typeof modelValue === 'string' || typeof modelValue === 'number') {
                const modelDoc = await req.payload.findByID({
                  collection: 'ai-models',
                  id: modelValue,
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
                model: modelId || 'llava:latest',
                apiUrl,
                apiKey,
              }
            } else if (provider === 'ollama-cloud') {
              // Use default cloud URL if not provided
              const cloudApiUrl = apiUrl || 'https://ollama.com'

              if (!apiKey) {
                return Response.json(
                  {
                    error: 'Ollama Cloud requires an API key. Get one from https://ollama.com',
                  },
                  { status: 400 },
                )
              }

              providerConfig = {
                provider: 'ollama-cloud',
                model: modelId || 'llava', // Default to llava for cloud compatibility
                apiUrl: cloudApiUrl,
                apiKey,
              }
            } else if (provider === 'google-gemini') {
              if (!apiKey) {
                return Response.json(
                  { error: 'Google Gemini API key is required in provider settings' },
                  { status: 400 },
                )
              }
              providerConfig = {
                provider: 'google-gemini',
                model: modelId || 'models/gemini-2.5-flash',
                apiKey,
                apiUrl,
              }
            } else if (provider === 'claude-api') {
              if (!apiKey) {
                return Response.json(
                  { error: 'Claude API key is required in provider settings' },
                  { status: 400 },
                )
              }
              providerConfig = {
                provider: 'claude-api',
                model: modelId || 'claude-sonnet-4-5-20250929',
                apiKey,
              }
            } else {
              return Response.json({ error: `Unknown provider: ${provider}` }, { status: 400 })
            }
          } else {
            // Fallback to plugin config for backward compatibility
            providerConfig = {
              provider: 'ollama',
              model: config.ollamaConfig.model,
              apiUrl: config.ollamaConfig.apiUrl,
              apiKey: config.ollamaConfig.apiKey,
            }
          }
        } catch (error) {
          // If global settings not found or error, fall back to plugin config
          console.warn('Using fallback provider configuration:', error)
          providerConfig = {
            provider: 'ollama',
            model: config.ollamaConfig.model,
            apiUrl: config.ollamaConfig.apiUrl,
            apiKey: config.ollamaConfig.apiKey,
          }
        }

        // Generate suggestions using configured provider
        try {
          const suggestions = await generateMediaSuggestions(
            imageBuffer,
            imageMimeType,
            providerConfig,
            context,
          )

          return Response.json({
            success: true,
            suggestions,
          })
        } catch (error) {
          console.error('AI provider error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          return Response.json(
            {
              error: 'Failed to generate AI suggestions',
              details: errorMessage,
            },
            { status: 500 },
          )
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        return Response.json({ error: 'An unexpected error occurred' }, { status: 500 })
      }
    },
  }
}
