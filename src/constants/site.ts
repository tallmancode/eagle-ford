export const SITE_NAME = 'Eagle Ford'
export const SITE_TITLE_SUFFIX = `| ${SITE_NAME}`
export const ADMIN_TITLE_SUFFIX = `| ${SITE_NAME} CMS`
export const SITE_SHORT_NAME = 'Eagle'
export const DEFAULT_OG_DESCRIPTION =
  'Your trusted Ford dealer for new Ranger, Everest, Territory, Mustang and commercial vehicles. Book a test drive, service or explore specials at eagleford.co.za.'

/** Default Open Graph / social share image (must exist under /public). */
export const DEFAULT_OG_IMAGE_PATH = '/website-template-OG.webp'

export function formatPageTitle(pageTitle?: string | null): string {
  return pageTitle ? `${pageTitle} ${SITE_TITLE_SUFFIX}` : SITE_NAME
}
