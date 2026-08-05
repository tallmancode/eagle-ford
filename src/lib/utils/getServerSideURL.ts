function normalizeOrigin(url: string): string {
  return url.replace(/\/+$/, '')
}

export const getServerSideURL = () => {
  const raw =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3001')

  return normalizeOrigin(raw)
}

export const isHttpsDeployment = () => getServerSideURL().startsWith('https://')

/**
 * Origins allowed for Payload CSRF / CORS cookie auth.
 * Includes apex + www so admin requests are not rejected when Origin differs slightly.
 */
export function getTrustedOrigins(): string[] {
  const primary = getServerSideURL()
  const origins = new Set<string>([primary])

  try {
    const url = new URL(primary)
    if (url.hostname.startsWith('www.')) {
      origins.add(`${url.protocol}//${url.hostname.slice(4)}${url.port ? `:${url.port}` : ''}`)
    } else if (url.hostname.includes('.')) {
      origins.add(`${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ''}`)
    }
  } catch {
    // Ignore invalid URL — primary alone is still returned.
  }

  return [...origins].filter(Boolean)
}
