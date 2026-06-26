export const SITE_NAME = 'Eagle Ford'
export const SITE_TITLE_SUFFIX = `| ${SITE_NAME}`
export const ADMIN_TITLE_SUFFIX = `| ${SITE_NAME} CMS`
export const SITE_SHORT_NAME = 'Eagle'
export const DEFAULT_OG_DESCRIPTION =
  'Quality pre-owned vehicles and trusted service at Eagle Motor City.'

export const DEFAULT_OG_IMAGE_PATH = '/eagle-motor-city-og.png'

export function formatPageTitle(pageTitle?: string | null): string {
  return pageTitle ? `${pageTitle} ${SITE_TITLE_SUFFIX}` : SITE_NAME
}
