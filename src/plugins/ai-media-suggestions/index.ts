import type { Config, Plugin } from 'payload'
import type { AIMediaSuggestionsPluginConfig, ResolvedPluginConfig } from './types'
import { AIModelsCollection } from './collections/AIModelsCollection'
import { createAISuggestionsEndpoint } from './endpoints/aiSuggestions'
import { createListModelsEndpoint } from './endpoints/listModels'
import { createRefetchModelsEndpoint } from './endpoints/refetchModels'
import { createTestProviderEndpoint } from './endpoints/testProvider'
import { AIProviderSettings } from './globals/AIProviderSettings'

/**
 * AI Media Suggestions Plugin
 *
 * Adds AI-powered metadata suggestions to upload collections.
 * Uses Ollama vision models to analyze images and generate title, alt text, and credits.
 *
 * @param pluginConfig - Configuration options for the plugin
 * @returns Payload plugin function
 *
 * @example
 * ```ts
 * import { aiMediaSuggestionsPlugin } from './plugins/ai-media-suggestions'
 *
 * export default buildConfig({
 *   plugins: [
 *     aiMediaSuggestionsPlugin({
 *       collections: ['media'], // Optional: defaults to all upload collections
 *       fieldMappings: {        // Optional: customize field names
 *         title: 'title',
 *         alt: 'alt',
 *         credits: 'creditText'
 *       }
 *     })
 *   ]
 * })
 * ```
 */
export const aiMediaSuggestionsPlugin = (
  pluginConfig: AIMediaSuggestionsPluginConfig = {},
): Plugin => {
  return (incomingConfig: Config): Config => {
    // Resolve configuration with defaults
    const resolvedConfig: ResolvedPluginConfig = {
      collections: pluginConfig.collections || [],
      fieldMappings: {
        title: pluginConfig.fieldMappings?.title || 'title',
        alt: pluginConfig.fieldMappings?.alt || 'alt',
        credits: pluginConfig.fieldMappings?.credits || 'creditText',
      },
      ollamaConfig: {
        apiUrl:
          pluginConfig.ollamaConfig?.apiUrl ||
          process.env.OLLAMA_API_URL ||
          'http://localhost:11434',
        model: pluginConfig.ollamaConfig?.model || process.env.OLLAMA_MODEL || 'llava:latest',
        apiKey: pluginConfig.ollamaConfig?.apiKey || process.env.OLLAMA_API_KEY,
      },
      providerSettingsSlug: pluginConfig.providerSettingsSlug || 'ai-provider-settings',
      endpointPath: pluginConfig.endpointPath || '/ai-suggestions',
      sidebarPosition:
        pluginConfig.sidebarPosition !== undefined ? pluginConfig.sidebarPosition : true,
    }

    // Determine which collections to apply the plugin to
    let targetCollections = resolvedConfig.collections

    // If no collections specified, apply to all upload collections
    if (!targetCollections || targetCollections.length === 0) {
      targetCollections =
        incomingConfig.collections
          ?.filter(
            (collection) =>
              collection.upload === true ||
              (collection.upload && typeof collection.upload === 'object'),
          )
          .map((collection) => collection.slug) || []
    }

    // Inject AI suggestions field into target collections
    const modifiedCollections = incomingConfig.collections?.map((collection) => {
      // Skip if this collection is not in the target list
      if (!targetCollections.includes(collection.slug)) {
        return collection
      }

      // Skip if collection is not an upload collection
      if (!collection.upload) {
        console.warn(
          `[AI Media Suggestions Plugin] Collection "${collection.slug}" is not an upload collection. Skipping.`,
        )
        return collection
      }

      // Add the AI suggestions UI field
      const aiSuggestionsField = {
        name: 'aiSuggestions',
        type: 'ui' as const,
        admin: {
          components: {
            Field: {
              path: '@/plugins/ai-media-suggestions/components/AISuggestionsField',
              exportName: 'AISuggestionsField',
              clientProps: {
                endpointPath: resolvedConfig.endpointPath,
                fieldMappings: resolvedConfig.fieldMappings,
              },
            },
          },
          position: resolvedConfig.sidebarPosition ? ('sidebar' as const) : undefined,
        },
      }

      return {
        ...collection,
        fields: [...(collection.fields || []), aiSuggestionsField],
      }
    })

    // Register the custom endpoints
    const aiSuggestionsEndpoint = createAISuggestionsEndpoint(resolvedConfig)
    const listModelsEndpoint = createListModelsEndpoint(resolvedConfig)
    const refetchModelsEndpoint = createRefetchModelsEndpoint(resolvedConfig)
    const testProviderEndpoint = createTestProviderEndpoint(resolvedConfig)

    // Register the provider settings global
    const modifiedGlobals = [...(incomingConfig.globals || []), AIProviderSettings]

    return {
      ...incomingConfig,
      collections: [...(modifiedCollections ?? []), AIModelsCollection],
      globals: modifiedGlobals,
      endpoints: [
        ...(incomingConfig.endpoints || []),
        aiSuggestionsEndpoint,
        listModelsEndpoint,
        refetchModelsEndpoint,
        testProviderEndpoint,
      ],
    }
  }
}

// Export types for external use
export type { AIMediaSuggestionsPluginConfig, MediaSuggestions } from './types'
