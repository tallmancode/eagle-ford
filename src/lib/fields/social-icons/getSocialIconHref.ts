const TEL_PREFIX = 'tel:'

export function getSocialIconHref(platform: string, url: string): string {
  if (platform === 'phone' && !url.startsWith(TEL_PREFIX)) {
    return `${TEL_PREFIX}${url}`
  }

  return url
}

export function isNativeLinkPlatform(platform: string): boolean {
  return platform === 'phone'
}
