import Anthropic from '@anthropic-ai/sdk'
import type { MediaSuggestions, ClaudeApiProviderConfig } from '../../types'
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

/** Allowed image media types for Claude API */
const ALLOWED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const

function normalizeMediaType(
  mimeType: string,
): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
  const normalized = mimeType.toLowerCase().split(';')[0].trim()
  if (ALLOWED_MEDIA_TYPES.includes(normalized as (typeof ALLOWED_MEDIA_TYPES)[number])) {
    return normalized as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
  }
  // Fallback for unsupported types (e.g. image/heic)
  return 'image/jpeg'
}

/**
 * Generate AI-powered suggestions for media metadata using Claude (Anthropic API) Vision
 *
 * Uses the Messages API with base64 image input. Vision-capable models include
 * claude-sonnet-4-5, claude-3-5-sonnet, claude-3-opus, etc.
 * API key: https://console.anthropic.com/
 *
 * @param imageBuffer - The image file buffer
 * @param mimeType - The image MIME type (e.g., 'image/jpeg')
 * @param config - Claude API provider configuration
 * @param additionalContext - Optional additional context or instructions for the AI
 * @returns Structured suggestions for title, alt text, and credits
 */
export async function generateSuggestionsWithClaude(
  imageBuffer: Buffer,
  mimeType: string,
  config: ClaudeApiProviderConfig,
  additionalContext?: string,
): Promise<MediaSuggestions> {
  const model = config.model
  const apiKey = config.apiKey

  if (!apiKey) {
    throw new Error('Claude API key is not configured')
  }

  if (!model) {
    throw new Error('Claude model is not configured')
  }

  const mediaType = normalizeMediaType(mimeType)
  const base64Image = imageBuffer.toString('base64')

  let prompt = `${BRAND_VOICE_INSTRUCTION}

Analyze this image and provide metadata. Respond with ONLY a valid JSON object in this exact format:

{"title":"SEO title (max 60 chars)","alt":"Accessible description (max 150 chars)","credits":"Source/brand or Unknown"}

Requirements:
- Title: Keyword-rich, descriptive, relative to Ford vehicles, dealership, or automotive service
- Alt: What's in the image with context for Eagle Ford shoppers; identify vehicle, trim, or brand logos if present
- Credits: Identify brand/logo/source or use "Unknown"
- Keep responses concise and within character limits
- Output ONLY the JSON, no other text`

  if (additionalContext) {
    prompt += `\nContext: ${additionalContext}`
  }

  let responseText: string
  try {
    const anthropic = new Anthropic({ apiKey })

    const message = await anthropic.messages.create({
      model,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === 'text')
    responseText = textBlock && 'text' in textBlock ? textBlock.text.trim() : ''
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw new Error('Claude API request timed out after 60 seconds')
      }
      if (
        error.name === 'AuthenticationError' ||
        error.message.includes('401') ||
        error.message.includes('invalid_api_key')
      ) {
        throw new Error(
          `Invalid Claude API key. Get a key at https://console.anthropic.com/ Error: ${error.message}`,
        )
      }
      if (error.name === 'PermissionDeniedError' || error.message.includes('403')) {
        throw new Error(`Claude API permission denied. Error: ${error.message}`)
      }
      if (error.name === 'RateLimitError' || error.message.includes('429')) {
        throw new Error(`Claude API rate limit exceeded. Error: ${error.message}`)
      }
      if (
        error.message.includes('model') ||
        error.message.includes('not found') ||
        error.message.includes('404')
      ) {
        throw new Error(
          `Model "${model}" not found or not available for vision. ` +
            `Check model ID at https://docs.anthropic.com/en/docs/about-claude/models. Original error: ${error.message}`,
        )
      }
      throw new Error(`Failed to generate suggestions: ${error.message}`)
    }
    throw new Error('Failed to generate suggestions: Unknown error')
  }

  if (!responseText) {
    throw new Error('Empty response from Claude API')
  }

  // Try to extract JSON from the response (handle ```json with or without closing fence, and truncated output)
  let jsonText = responseText
  const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1].trim()
  } else {
    // No closing ``` (e.g. truncated) – strip leading fence so we get content from first {
    jsonText = responseText.replace(/^```(?:json)?\s*\n?/i, '').trim()
  }

  let jsonStr: string
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    jsonStr = jsonMatch[0]
  } else {
    // Truncated: response has { but no closing } – take from first { and try to close
    const start = jsonText.indexOf('{')
    if (start === -1) {
      throw new Error(
        `No JSON object found in response. Received: ${responseText.substring(0, 300)}`,
      )
    }
    jsonStr = jsonText.slice(start)
    if (!jsonStr.endsWith('}')) {
      // Close an open string if present (odd number of unescaped ")
      const inKeyOrValue = (jsonStr.match(/"/g) || []).length % 2 !== 0
      if (inKeyOrValue) jsonStr += '"'
      if (!jsonStr.trimEnd().endsWith('}')) jsonStr += '}'
    }
    const openBraces = (jsonStr.match(/\{/g) || []).length
    const closeBraces = (jsonStr.match(/}/g) || []).length
    if (openBraces > closeBraces) {
      jsonStr += '}'.repeat(openBraces - closeBraces)
    }
  }

  let suggestions: MediaSuggestions
  try {
    suggestions = JSON.parse(jsonStr)
  } catch (_parseError) {
    let fixedJson = jsonStr
    if (!fixedJson.endsWith('}')) fixedJson += '}'
    const openBraces = (fixedJson.match(/\{/g) || []).length
    const closeBraces = (fixedJson.match(/}/g) || []).length
    if (openBraces > closeBraces) {
      fixedJson += '}'.repeat(openBraces - closeBraces)
    }
    try {
      suggestions = JSON.parse(fixedJson)
    } catch (_secondError) {
      throw new Error(
        `Failed to parse JSON response from Claude. Received: ${responseText.substring(0, 300)}`,
      )
    }
  }

  // Fill defaults for truncated responses missing fields
  if (!suggestions.title) suggestions.title = 'Image'
  if (!suggestions.alt) suggestions.alt = 'Image description'
  if (!suggestions.credits) suggestions.credits = 'Unknown'

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
