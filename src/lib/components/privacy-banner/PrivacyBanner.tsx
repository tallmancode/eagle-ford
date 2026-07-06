'use client'

import Link from 'next/link'
import * as React from 'react'

import { usePrivacy } from '@/lib/providers/privacy'
import { Button } from '@/lib/components/ui/button'
import { cn } from '@/utilities/ui'

export const PrivacyBanner: React.FC = () => {
  const [closeBanner, setCloseBanner] = React.useState(false)
  const [animateOut, setAnimateOut] = React.useState(false)

  const { showConsent, updateCookieConsent } = usePrivacy()

  const handleCloseBanner = () => {
    setAnimateOut(true)
  }

  React.useEffect(() => {
    if (animateOut) {
      setTimeout(() => {
        setCloseBanner(true)
      }, 300)
    }
  }, [animateOut])

  if (!showConsent || closeBanner) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-5 md:right-8 z-50 w-max max-w-xl border border-border transition-transform duration-300 ease-out',
        animateOut && 'translate-y-full',
      )}
    >
      <div className="relative flex flex-col items-start sm:items-center justify-between bg-secondary p-6">
        <p className="m-0 text-light-100 [&_a]:no-underline [&_a]:text-inherit [&_a]:border-b [&_a]:border-dotted [&_a]:border-current [&_a]:transition-all [&_a]:duration-200 [&_a]:hover:opacity-80">
          We use cookies, subject to your consent, to analyze the use of our website and to ensure
          you get the best experience. Third parties with whom we collaborate can also install
          cookies in order to show you personalized advertisements on other websites. Read our{' '}
          <Link className="hover:text-primary-600" href="/cookie" prefetch={false}>
            cookie policy
          </Link>{' '}
          for more information.
        </p>
        <div className="mt-6 max-sm:mt-4 flex w-full gap-4 [&_button]:w-1/2">
          <Button
            variant="outline"
            className="border-error text-error hover:border-light-200 hover:bg-error hover:text-light-50"
            onClick={() => {
              updateCookieConsent(false)
              handleCloseBanner()
            }}
          >
            Dismiss
          </Button>
          <Button
            className="border-light-100 bg-light-100 text-black hover:border-light-300 hover:bg-light-300"
            onClick={() => {
              updateCookieConsent(true)
              handleCloseBanner()
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
