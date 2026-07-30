import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MediaSuggestions, GoogleGeminiProviderConfig } from '../../types'
import { BRAND_VOICE_INSTRUCTION } from '../brandPrompt'

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
 * Generate AI-powered suggestions for media metadata using Google Gemini Vision
 *
 * Supported models (free tier compatible):
 * - models/gemini-2.5-flash (newest, recommended)
 * - models/gemini-2.5-flash-lite (faster, lighter)
 * - models/gemini-2.5-pro (most capable)
 * - models/gemini-2.0-flash (stable)
 * - models/gemini-flash-latest (auto-updates to latest)
 *
 * Note: Model names must include the "models/" prefix for the API to work correctly
 * Free tier info: https://ai.google.dev/pricing
 *
 * @param imageBuffer - The image file buffer
 * @param mimeType - The image MIME type (e.g., 'image/jpeg')
 * @param config - Google Gemini provider configuration
 * @param additionalContext - Optional additional context or instructions for the AI
 * @returns Structured suggestions for title, alt text, and credits
 */
export async function generateSuggestionsWithGoogle(
  imageBuffer: Buffer,
  mimeType: string,
  config: GoogleGeminiProviderConfig,
  additionalContext?: string,
): Promise<MediaSuggestions> {
  const model = config.model
  const apiKey = config.apiKey

  if (!apiKey) {
    throw new Error('Google Gemini API key is not configured')
  }

  if (!model) {
    throw new Error('Google Gemini model is not configured')
  }

  let responseText: string
  try {
    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(apiKey)
    const geminiModel = genAI.getGenerativeModel({ model })

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64')

    // Build the prompt - brand instruction + task (simplified and more explicit)
    let prompt = `${BRAND_VOICE_INSTRUCTION}

Analyze this image and provide metadata. Respond with ONLY a valid JSON object in this exact format:

{"title":"SEO title (max 60 chars)","alt":"Accessible description (max 150 chars)","credits":"Source/brand or Unknown"}

Requirements:
- Title: Keyword-rich, descriptive
- Alt: What's in the image with context
- Credits: Identify brand/logo/source or use "Unknown"
- Keep responses concise and within character limits
- Output ONLY the JSON, no other text`

    if (additionalContext) {
      prompt += `\nContext: ${additionalContext}`
    }

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    }

    // Generate content with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }, imagePart] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024, // Increased to ensure complete JSON response
      },
    })

    clearTimeout(timeoutId)

    const response = result.response
    responseText = response.text().trim()
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Google Gemini request timed out after 60 seconds')
      }
      if (
        error.message.includes('API_KEY_INVALID') ||
        error.message.includes('401') ||
        error.message.includes('403')
      ) {
        throw new Error(`Invalid Google Gemini API key. Error: ${error.message}`)
      }
      if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('429')) {
        throw new Error(`Google Gemini API quota exceeded or rate limited. Error: ${error.message}`)
      }
      if (
        error.message.includes('model') ||
        error.message.includes('not found') ||
        error.message.includes('404')
      ) {
        throw new Error(
          `Model "${model}" not found. This usually means:\n` +
            `1. Your API key is from Google Cloud (Vertex AI) instead of Google AI Studio - Get the correct key at https://aistudio.google.com/app/apikey\n` +
            `2. The model isn't available in your region\n` +
            `3. Your API key doesn't have access to Gemini models\n\n` +
            `Original error: ${error.message}`,
        )
      }
      throw new Error(`Failed to generate suggestions: ${error.message}`)
    }
    throw new Error('Failed to generate suggestions: Unknown error')
  }

  if (!responseText) {
    throw new Error('Empty response from Google Gemini')
  }

  // Try to extract JSON from the response
  // Remove markdown code blocks if present
  let jsonText = responseText
  const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim()
  }

  // Try to find JSON object - be more greedy to get complete JSON
  const jsonMatch = jsonText.match(/\{[\s\S]*}/)
  if (!jsonMatch) {
    throw new Error(
      `No complete JSON object found in response. ` +
        `This may indicate the response was truncated or the model didn't complete the JSON. ` +
        `Received: ${responseText.substring(0, 300)}`,
    )
  }

  let suggestions: MediaSuggestions
  try {
    suggestions = JSON.parse(jsonMatch[0])
  } catch (_parseError) {
    // If JSON parsing fails, try to fix incomplete JSON
    let fixedJson = jsonMatch[0]

    // If JSON is incomplete, try to close it
    if (!fixedJson.endsWith('}')) {
      fixedJson += '}'
    }

    // Count braces to see if we need more closing braces
    const openBraces = (fixedJson.match(/\{/g) || []).length
    const closeBraces = (fixedJson.match(/}/g) || []).length

    if (openBraces > closeBraces) {
      fixedJson += '}'.repeat(openBraces - closeBraces)
    }

    // Try parsing again
    try {
      suggestions = JSON.parse(fixedJson)
    } catch (_secondError) {
      throw new Error(
        `Failed to parse JSON response. The model may have exceeded token limits. ` +
          `Try using a Flash-Lite model for faster responses. ` +
          `Received: ${responseText.substring(0, 300)}`,
      )
    }
  }

  // Validate the response structure
  if (!suggestions.title || !suggestions.alt || !suggestions.credits) {
    throw new Error('Invalid response structure from Google Gemini')
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
