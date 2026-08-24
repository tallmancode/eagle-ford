import type { Metadata } from 'next'
import Script from 'next/script'

import { cn } from '@/lib/utils/cn'
import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'
import React, { Suspense } from 'react'
import { AdminBar } from '@/components/AdminBar'
import { JsonLd } from '@/components/JsonLd/JsonLd'
import { Providers } from '@/providers'

import './globals.css'
import '@/lib/blocks/v2/box.css'
import { getServerSideURL } from '@/lib/utils/getServerSideURL'
import { mergeOpenGraph } from '@/lib/utils/mergeOpenGraph'
import { getDefaultRobots } from '@/constants/crawlerPolicy'
import { SITE_FAVICON_ICONS } from '@/constants/siteIcons'
import { SiteHeader } from '@/components/header/SiteHeader'
import { SiteFooter } from '@/components/footer/SiteFooter'
import { getCachedGlobal } from '@/lib/utils/getGlobals'
import { navNeedsVehicleMegaMenu } from '@/lib/data/vehicleMegaMenuTypes'
import { getVehicleMegaMenuData } from '@/lib/data/getVehicleMegaMenuData'
import {
  buildJsonLdGraph,
  getDealershipJsonLd,
  getWebSiteJsonLd,
} from '@/lib/seo/dealershipJsonLd'
import type {
  Footer as GlobalFooter,
  Header as GlobalHeader,
  Setting as GlobalSettings,
} from '@/payload-types'
import { PrivacyProvider } from '@/lib/providers/privacy'
import { PrivacyBanner } from '@/lib/components/privacy-banner/PrivacyBanner'
import { BackToTopButton } from '@/lib/components/back-to-top/BackToTopButton'
import { WhatsAppFloatingButton } from '@/components/WhatsAppFloatingButton'
import { ConsentAwareGoogleTagManager } from '@/components/analytics/ConsentAwareGoogleTagManager'
import {
  isAnalyticsLiveProduction,
  shouldLoadGoogleTagManager,
} from '@/components/analytics/googleTagManager'
import { GTMPageView } from '@/components/analytics/GTMPageView'
import { GTMCtaClickTracker } from '@/components/analytics/GTMCtaClickTracker'

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

const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
});
`

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

  const gtmId = shouldLoadGoogleTagManager({
    enabled: globalSettings.analytics?.enableGoogleTagManager,
    containerId: globalSettings.analytics?.googleTagManagerId,
  })
  const analyticsLive = isAnalyticsLiveProduction()

  return (
    <html
      className={cn(GeistMono.variable, fordF1.variable)}
      data-theme="light"
      lang="en"
      {...(analyticsLive ? { 'data-analytics': 'live' } : {})}
    >
      <head>
        {gtmId ? (
          <Script id="gtm-consent-default" strategy="beforeInteractive">
            {CONSENT_DEFAULT_SCRIPT}
          </Script>
        ) : null}
      </head>
      <PrivacyProvider>
        <body className="font-ford">
          {gtmId ? (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
                title="Google Tag Manager"
              />
            </noscript>
          ) : null}
          <ConsentAwareGoogleTagManager
            containerId={globalSettings.analytics?.googleTagManagerId}
            enabled={globalSettings.analytics?.enableGoogleTagManager}
          />
          <Suspense fallback={null}>
            <GTMPageView gtmId={gtmId} />
          </Suspense>
          <GTMCtaClickTracker gtmId={gtmId} />
          <JsonLd
            data={buildJsonLdGraph(
              getDealershipJsonLd(globalSettings.contactInfo),
              getWebSiteJsonLd(),
            )}
          />
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
            <WhatsAppFloatingButton
              number={globalSettings.whatsappButton?.whatsappNumber}
              message={globalSettings.whatsappButton?.whatsappMessage}
            />
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
  robots: getDefaultRobots(),
  openGraph: mergeOpenGraph(),
  icons: SITE_FAVICON_ICONS,
  twitter: {
    card: 'summary_large_image',
  },
}
