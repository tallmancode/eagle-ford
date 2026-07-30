import type { Metadata } from 'next'

import { cn } from '@/lib/utils/cn'
import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'
import React from 'react'
import { AdminBar } from '@/components/AdminBar'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Providers } from '@/providers'

import './globals.css'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { CRAWLER_BLOCK_ROBOTS } from '@/constants/crawlerPolicy'
import { SITE_FAVICON_ICONS } from '@/constants/siteIcons'
import { SiteHeader } from '@/components/header/SiteHeader'
import { SiteFooter } from '@/components/footer/SiteFooter'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { navNeedsVehicleMegaMenu } from '@/lib/data/vehicleMegaMenuTypes'
import { getVehicleMegaMenuData } from '@/lib/data/getVehicleMegaMenuData'
import { getDealershipJsonLd } from '@/lib/seo/dealershipJsonLd'
import type {
  Footer as GlobalFooter,
  Header as GlobalHeader,
  Setting as GlobalSettings,
} from '@/payload-types'
import { PrivacyProvider } from '@/lib/providers/privacy'
import { PrivacyBanner } from '@/lib/components/privacy-banner/PrivacyBanner'
import { BackToTopButton } from '@/lib/components/back-to-top/BackToTopButton'
import { ConsentAwareGoogleTagManager } from '@/components/analytics/ConsentAwareGoogleTagManager'

const fordF1 = localFont({
  src: [
    { path: '../../assets/fonts/FordF-1-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/FordF-1-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/FordF-1-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-ford-f1',
  display: 'swap',
  preload: true,
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [globalHeader, globalFooter, globalSettings] = (await Promise.all([
    getCachedGlobal('header', 1),
    getCachedGlobal('footer', 1),
    getCachedGlobal('settings', 1),
  ])) as [GlobalHeader, GlobalFooter, GlobalSettings]

  const allNavLinks = [...(globalHeader.leftLinks ?? []), ...(globalHeader.rightLinks ?? [])]
  const vehicleMegaMenuData = navNeedsVehicleMegaMenu(allNavLinks)
    ? await getVehicleMegaMenuData()
    : null

  return (
    <html className={cn(GeistMono.variable, fordF1.variable)} data-theme="light" lang="en">
      <PrivacyProvider>
        <body className="font-ford">
          <ConsentAwareGoogleTagManager
            containerId={globalSettings.analytics?.googleTagManagerId}
            enabled={globalSettings.analytics?.enableGoogleTagManager}
          />
          <JsonLd data={getDealershipJsonLd()} />
          <Providers>
            {/* preview is resolved client-side via admin-bar auth; avoid draftMode() here so pages can cache */}
            <AdminBar adminBarProps={{ preview: true }} />
            <SiteHeader
              globalHeader={globalHeader}
              globalSettings={globalSettings}
              vehicleMegaMenuData={vehicleMegaMenuData}
            />
            {children}
            <BackToTopButton />
            <PrivacyBanner></PrivacyBanner>
            <SiteFooter footer={globalFooter} />
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
  },
}
