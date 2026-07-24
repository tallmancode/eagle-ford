import type { Config, Plugin } from 'payload'
import { createAISeoGenerateEndpoint } from './endpoints/aiSeoGenerate'

/**
 * AI SEO Plugin
 * Adds an endpoint for AI-powered SEO metadata generation.
 * Use with AIGenerateField component in collection SEO tabs.
 */
export const aiSeoPlugin = (): Plugin => {
  return (config: Config): Config => {
    const endpoint = createAISeoGenerateEndpoint()
    return {
      ...config,
      endpoints: [...(config.endpoints ?? []), endpoint],
    }
  }
}
