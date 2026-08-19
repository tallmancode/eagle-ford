import * as Sentry from '@sentry/nextjs'

export function captureAiSeoEvent(args: {
  error?: unknown
  reason: string
  collectionSlug?: string | null
  slug?: string | null
  detail?: string
}): void {
  Sentry.withScope((scope) => {
    scope.setTag('feature', 'ai-seo')
    scope.setTag('ai_seo.reason', args.reason)
    if (args.collectionSlug) scope.setTag('collection', args.collectionSlug)
    if (args.slug) scope.setTag('slug', args.slug)
    scope.setContext('ai_seo', {
      reason: args.reason,
      collectionSlug: args.collectionSlug ?? null,
      slug: args.slug ?? null,
      detail: args.detail ?? null,
    })

    if (args.error instanceof Error) {
      Sentry.captureException(args.error)
      return
    }

    Sentry.captureMessage(`AI SEO: ${args.reason}`, 'warning')
  })
}
