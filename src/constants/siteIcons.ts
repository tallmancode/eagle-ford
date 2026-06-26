import type { Metadata } from 'next'

export const SITE_FAVICON_LINKS = [
  {
    rel: 'icon',
    type: 'image/png',
    url: '/favicon/favicon-96x96.png',
    sizes: '96x96',
  },
  {
    rel: 'icon',
    type: 'image/svg+xml',
    url: '/favicon/favicon.svg',
  },
  {
    rel: 'shortcut icon',
    url: '/favicon/favicon.ico',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    url: '/favicon/apple-touch-icon.png',
  },
  {
    rel: 'manifest',
    url: '/favicon/site.webmanifest',
  },
] as const

export const SITE_FAVICON_ICONS: NonNullable<Metadata['icons']> = {
  icon: [
    { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
  ],
  shortcut: '/favicon/favicon.ico',
  apple: '/favicon/apple-touch-icon.png',
  other: { rel: 'manifest', url: '/favicon/site.webmanifest' },
}
