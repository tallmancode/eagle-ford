import { Ollama } from 'ollama'
import type { MediaSuggestions } from '../types'

interface OllamaGenerateResponse {
  response?: string
  error?: string
  thinking?: string
}

/**
 * Intelligently truncate text to a maximum length at word boundaries
 * @param text - Text to truncate
 * @param maxLength - Maximum character length
 * @returns Truncated text ending at a word boundary
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text

  // Find the last space before maxLength
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  // If we found a space, truncate there; otherwise use the full maxLength
  return lastSpace > 0 ? truncated.substring(0, lastSpace).trim() : truncated.trim()
}

/**
 * Generate AI-powered suggestions for media metadata using Ollama vision model
 * @param imageBuffer - The image file buffer
 * @param mimeType - The image MIME type (e.g., 'image/jpeg')
 * @param config - Ollama configuration (apiUrl, model, apiKey)
 * @param additionalContext - Optional additional context or instructions for the AI
 * @returns Structured suggestions for title, alt text, and credits
 */
export async function generateMediaSuggestions(
  imageBuffer: Buffer,
  mimeType: string,
  config: {
    apiUrl: string
    model: string
    apiKey?: string
  },
  additionalContext?: string,
): Promise<MediaSuggestions> {
  let apiUrl = config.apiUrl
  const model = config.model
  const apiKey = config.apiKey

  if (!apiUrl) {
    throw new Error('Ollama API URL is not configured')
  }

  if (!model) {
    throw new Error('Ollama model is not configured')
  }

  // Normalize the URL for Ollama SDK
  // The SDK appends /api/generate automatically, so we need the base URL only
  // For cloud API: https://ollama.com (not https://ollama.com/api)
  // For local: http://localhost:11434
  apiUrl = apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')

  // Initialize Ollama client
  const ollama = new Ollama({
    host: apiUrl,
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
  })

  // Convert buffer to base64
  const base64Image = imageBuffer.toString('base64')

  // Build the prompt - concise for reasoning models
  let prompt = `Analyze this image and return ONLY this JSON (no other text):

{
  "title": "SEO title (max 60 chars)",
  "alt": "Accessible description (max 150 chars)",
  "credits": "Source/brand or Unknown (max 100 chars)"
}

Requirements:
- Title: Keyword-rich, descriptive for developer content
- Alt: What's in the image, include technical context
- Credits: Identify brand/logo/source visible in image`

  if (additionalContext) {
    prompt += `\n\nContext: ${additionalContext}`
  }

  prompt += `\n\nReturn ONLY the JSON object, nothing else.`

  let response: OllamaGenerateResponse
  try {
    // Call Ollama vision model with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout for cloud

    response = (await ollama.generate({
      model,
      prompt,
      images: [base64Image],
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 500, // Increased for reasoning models with thinking field
      },
    })) as OllamaGenerateResponse

    clearTimeout(timeoutId)
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Ollama request timed out after 60 seconds')
      }
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        throw new Error(
          `Cannot connect to Ollama at ${apiUrl}. Is Ollama running? Error: ${error.message}`,
        )
      }
      if (
        error.message.includes('401') ||
        error.message.includes('403') ||
        error.message.includes('unauthorized')
      ) {
        throw new Error(`Authentication failed. Check your OLLAMA_API_KEY. Error: ${error.message}`)
      }
      if (error.message.includes('model') || error.message.includes('not found')) {
        throw new Error(`Model "${model}" not found or not available. Error: ${error.message}`)
      }
      throw new Error(`Failed to generate suggestions: ${error.message}`)
    }
    throw new Error('Failed to generate suggestions: Unknown error')
  }

  // Check if response has an error (API-level, not network)
  if (response.error) {
    throw new Error(`Ollama returned error: ${response.error}`)
  }

  // Parse the response - some models use 'thinking' field for chain-of-thought
  let responseText = response.response?.trim() || ''
  if (!responseText && response.thinking) {
    responseText = response.thinking.trim()
  }

  // Try to extract JSON from the response
  const jsonMatch = responseText.match(/\{[\s\S]*}/)
  if (!jsonMatch) {
    throw new Error(
      `No JSON object found in response. Model may need more tokens. Received: ${responseText.substring(0, 200)}`,
    )
  }

  const suggestions: MediaSuggestions = JSON.parse(jsonMatch[0])

  // Validate the response structure
  if (!suggestions.title || !suggestions.alt || !suggestions.credits) {
    throw new Error('Invalid response structure from Ollama')
  }

  // Auto-truncate if limits exceeded
  if (suggestions.title.length > 60) {
    suggestions.title = truncateAtWordBoundary(suggestions.title, 60)
  }

  if (suggestions.alt.length > 150) {
    suggestions.alt = truncateAtWordBoundary(suggestions.alt, 150)
  }

  if (suggestions.credits.length > 100) {
    suggestions.credits = truncateAtWordBoundary(suggestions.credits, 100)
  }

  return suggestions
}
