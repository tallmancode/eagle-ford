/**
 * Whether a nav href matches the current pathname.
 * External URLs are never active. Home (`/`) matches only exactly;
 * other paths match exactly or as a nested prefix.
 */
export const isNavLinkActive = (pathname: string, href: string): boolean => {
  if (!href || href === '#') return false
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return false
  }
  if (href.startsWith('tel:')) return false

  let path = href
  try {
    if (href.startsWith('/')) {
      const url = new URL(href, 'http://local')
      path = url.pathname
    } else {
      return false
    }
  } catch {
    return false
  }

  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  if (path === '/') return pathname === '/'

  return pathname === path || pathname.startsWith(`${path}/`)
}

/** Focus/tap highlight reset for site header nav text links (iPhone Safari). */
export const navLinkFocusResetClass =
  'outline-none focus:outline-none focus-visible:outline-none focus:bg-transparent focus-visible:bg-transparent [-webkit-tap-highlight-color:transparent]'
