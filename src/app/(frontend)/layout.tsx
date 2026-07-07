import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import localFont from 'next/font/local'
import React from 'react'
import { AdminBar } from '@/components/AdminBar'
import { Providers } from '@/providers'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { CRAWLER_BLOCK_ROBOTS } from '@/constants/crawlerPolicy'
import { SITE_FAVICON_ICONS } from '@/constants/siteIcons'
import { SiteHeader } from '@/components/header/SiteHeader'
import { SiteFooter } from '@/components/footer/SiteFooter'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import type { Header as GlobalHeader, Setting as GlobalSettings } from '@/payload-types'
import { PrivacyProvider } from '@/lib/providers/privacy'
import { PrivacyBanner } from '@/lib/components/privacy-banner/PrivacyBanner'
import { BackToTopButton } from '@/lib/components/back-to-top/BackToTopButton'

const fordF1 = localFont({
  src: [
    { path: '../../assets/fonts/FordF-1-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/FordF-1-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/FordF-1-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-ford-f1',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  const [globalHeader, , globalSettings] = (await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('settings', 1)(),
  ])) as [GlobalHeader, unknown, GlobalSettings]

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, fordF1.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <PrivacyProvider>
        <body className="font-ford">
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
            <SiteHeader globalHeader={globalHeader} globalSettings={globalSettings} />
            {children}
            <BackToTopButton />
            <PrivacyBanner></PrivacyBanner>
            <SiteFooter />
          </Providers>
        </body>
      </PrivacyProvider>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  robots: CRAWLER_BLOCK_ROBOTS,
  openGraph: mergeOpenGraph(),
  icons: SITE_FAVICON_ICONS,
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
