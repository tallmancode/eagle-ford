/**
 * Supported AI provider types
 */
export type ProviderType = 'ollama' | 'ollama-cloud' | 'google-gemini' | 'claude-api'

/**
 * Base provider configuration
 */
export interface BaseProviderConfig {
  provider: ProviderType
  model: string
  apiKey?: string
}

/**
 * Ollama-specific configuration (local/self-hosted)
 */
export interface OllamaProviderConfig extends BaseProviderConfig {
  provider: 'ollama'
  apiUrl: string
}

/**
 * Ollama Cloud-specific configuration (hosted at ollama.com)
 */
export interface OllamaCloudProviderConfig extends BaseProviderConfig {
  provider: 'ollama-cloud'
  apiUrl: string
  apiKey: string // Required for cloud
}

/**
 * Google Gemini-specific configuration
 */
export interface GoogleGeminiProviderConfig extends BaseProviderConfig {
  provider: 'google-gemini'
  apiUrl?: string // Optional for Google
}

/**
 * Claude (Anthropic API)-specific configuration
 */
export interface ClaudeApiProviderConfig extends BaseProviderConfig {
  provider: 'claude-api'
  apiKey: string // Required for Anthropic API
}

/**
 * Union type for all provider configurations
 */
export type ProviderConfig =
  | OllamaProviderConfig
  | OllamaCloudProviderConfig
  | GoogleGeminiProviderConfig
  | ClaudeApiProviderConfig

/**
 * Configuration options for the AI Media Suggestions plugin
 */
export interface AIMediaSuggestionsPluginConfig {
  /**
   * Array of collection slugs to apply AI suggestions to.
   * If not provided, will apply to all upload collections.
   */
  collections?: string[]

  /**
   * Field name mappings for where to store AI suggestions.
   * Defaults to { title: 'title', alt: 'alt', credits: 'creditText' }
   */
  fieldMappings?: {
    title?: string
    alt?: string
    credits?: string
  }

  /**
   * Ollama configuration options (for backward compatibility)
   * @deprecated Use global settings instead
   */
  ollamaConfig?: {
    /**
     * Ollama API URL
     * @default process.env.OLLAMA_API_URL || 'http://localhost:11434'
     */
    apiUrl?: string

    /**
     * Ollama model to use for vision tasks
     * @default process.env.OLLAMA_MODEL || 'llava:latest'
     */
    model?: string

    /**
     * Optional API key for authentication
     * @default process.env.OLLAMA_API_KEY
     */
    apiKey?: string
  }

  /**
   * Custom slug for the provider settings global
   * @default 'ai-provider-settings'
   */
  providerSettingsSlug?: string

  /**
   * Custom endpoint path for AI suggestions
   * @default '/ai-suggestions'
   */
  endpointPath?: string

  /**
   * Whether to position the field in the sidebar
   * @default true
   */
  sidebarPosition?: boolean
}

/**
 * Internal plugin configuration with all defaults applied
 */
export interface ResolvedPluginConfig {
  collections: string[]
  fieldMappings: {
    title: string
    alt: string
    credits: string
  }
  ollamaConfig: {
    apiUrl: string
    model: string
    apiKey?: string
  }
  providerSettingsSlug: string
  endpointPath: string
  sidebarPosition: boolean
}

/**
 * AI-generated media suggestions response
 */
export interface MediaSuggestions {
  title: string
  alt: string
  credits: string
}
