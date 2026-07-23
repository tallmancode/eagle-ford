import type { MediaSuggestions, ProviderConfig } from '../types'
import { generateSuggestionsWithClaude } from './providers/claude'
import { generateSuggestionsWithGoogle } from './providers/google'
import { generateSuggestionsWithOllama } from './providers/ollama'

/**
 * Generate AI-powered suggestions for media metadata using the configured provider
 * @param imageBuffer - The image file buffer
 * @param mimeType - The image MIME type (e.g., 'image/jpeg')
 * @param config - Provider configuration (Ollama or Google Gemini)
 * @param additionalContext - Optional additional context or instructions for the AI
 * @returns Structured suggestions for title, alt text, and credits
 */
export async function generateMediaSuggestions(
  imageBuffer: Buffer,
  mimeType: string,
  config: ProviderConfig,
  additionalContext?: string,
): Promise<MediaSuggestions> {
  // Route to the appropriate provider based on configuration
  switch (config.provider) {
    case 'ollama':
    case 'ollama-cloud':
      return generateSuggestionsWithOllama(imageBuffer, mimeType, config, additionalContext)

    case 'google-gemini':
      return generateSuggestionsWithGoogle(imageBuffer, mimeType, config, additionalContext)

    case 'claude-api':
      return generateSuggestionsWithClaude(imageBuffer, mimeType, config, additionalContext)

    default: {
      // TypeScript should prevent this, but add runtime check for safety
      const cfg = config as ProviderConfig
      throw new Error(`Unsupported provider: ${cfg.provider}`)
    }
  }
}
