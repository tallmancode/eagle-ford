/**
 * AI-powered text generation for SEO metadata (title, description) and other text fields.
 * Reuses provider configuration from ai-media-suggestions (ai-provider-settings global).
 * Supports Claude, Google Gemini, and Ollama - text-only (no image input).
 */

import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Ollama } from 'ollama'
import type {
  ClaudeApiProviderConfig,
  GoogleGeminiProviderConfig,
  OllamaCloudProviderConfig,
  OllamaProviderConfig,
  ProviderConfig,
} from '@/plugins/ai-media-suggestions/types'
import { BRAND_VOICE_INSTRUCTION } from '@/plugins/ai-media-suggestions/utils/brandPrompt'

const TITLE_MAX_LENGTH = 60
const DESCRIPTION_MAX_LENGTH = 155

function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? truncated.substring(0, lastSpace).trim() : truncated.trim()
}

const SEO_PROMPT = `${BRAND_VOICE_INSTRUCTION}

Based on the following content, generate SEO metadata. Respond with ONLY a valid JSON object in this exact format:
{"title":"SEO meta title (max 60 chars)","description":"Meta description (max 155 chars)"}

Requirements:
- Title: Concise, keyword-rich, compelling
- Description: Summary that encourages clicks, within 155 chars
- Output ONLY the JSON, no markdown or other text`

async function generateWithClaude(
  prompt: string,
  config: ClaudeApiProviderConfig,
): Promise<{ title: string; description: string }> {
  const anthropic = new Anthropic({ apiKey: config.apiKey })
  const fullPrompt = `${SEO_PROMPT}\n\nContent:\n${prompt}`

  const message = await anthropic.messages.create({
    model: config.model,
    max_tokens: 512,
    messages: [{ role: 'user', content: fullPrompt }],
  })

  const textBlock = message.content.find((block) => block.type === 'text')
  const responseText = textBlock && 'text' in textBlock ? textBlock.text.trim() : ''
  return parseSeoResponse(responseText)
}

async function generateWithGoogle(
  prompt: string,
  config: GoogleGeminiProviderConfig,
): Promise<{ title: string; description: string }> {
  if (!config.apiKey) throw new Error('Google Gemini API key is required')
  if (!config.model) throw new Error('Google Gemini model is required')
  const genAI = new GoogleGenerativeAI(config.apiKey)
  const model = genAI.getGenerativeModel({ model: config.model })
  const fullPrompt = `${SEO_PROMPT}\n\nContent:\n${prompt}`

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
  })

  const responseText = result.response.text().trim()
  return parseSeoResponse(responseText)
}

async function generateWithOllama(
  prompt: string,
  config: OllamaProviderConfig | OllamaCloudProviderConfig,
): Promise<{ title: string; description: string }> {
  const apiUrl = (config.apiUrl || 'http://localhost:11434')
    .replace(/\/api\/?$/, '')
    .replace(/\/$/, '')

  const ollama = new Ollama({
    host: apiUrl,
    headers: config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : undefined,
  })

  const fullPrompt = `${SEO_PROMPT}\n\nContent:\n${prompt}`

  const response = (await ollama.generate({
    model: config.model,
    prompt: fullPrompt,
    stream: false,
    options: { temperature: 0.7, num_predict: 512 },
  })) as { response?: string }

  const responseText = response.response?.trim() || ''
  return parseSeoResponse(responseText)
}

function parseSeoResponse(responseText: string): { title: string; description: string } {
  let jsonText = responseText
  const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeBlockMatch) jsonText = codeBlockMatch[1].trim()

  const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error(`No JSON found in AI response: ${responseText.substring(0, 200)}`)
  }

  let parsed: { title?: string; description?: string }
  try {
    parsed = JSON.parse(jsonMatch[0])
  } catch {
    throw new Error(`Invalid JSON in AI response: ${responseText.substring(0, 200)}`)
  }

  const title = (parsed.title || 'Untitled').trim()
  const description = (parsed.description || '').trim()

  return {
    title:
      title.length > TITLE_MAX_LENGTH ? truncateAtWordBoundary(title, TITLE_MAX_LENGTH) : title,
    description:
      description.length > DESCRIPTION_MAX_LENGTH
        ? truncateAtWordBoundary(description, DESCRIPTION_MAX_LENGTH)
        : description,
  }
}

/**
 * Generate SEO metadata (title and description) from content using AI.
 * Uses the configured provider from ai-provider-settings.
 *
 * @param prompt - Content to base the generation on (page text, excerpt, or custom prompt)
 * @param providerConfig - Provider configuration (from ai-provider-settings global)
 * @returns { title, description } - Truncated to SEO length limits
 */
export async function generateSEOMetadata(
  prompt: string,
  providerConfig: ProviderConfig,
): Promise<{ title: string; description: string }> {
  if (!prompt.trim()) {
    throw new Error('Prompt content is required for AI generation')
  }

  switch (providerConfig.provider) {
    case 'claude-api':
      return generateWithClaude(prompt, providerConfig)
    case 'google-gemini':
      return generateWithGoogle(prompt, providerConfig)
    case 'ollama':
    case 'ollama-cloud':
      return generateWithOllama(prompt, providerConfig)
    default: {
      const cfg = providerConfig as ProviderConfig
      throw new Error(`Unsupported provider for text generation: ${cfg.provider}`)
    }
  }
}
