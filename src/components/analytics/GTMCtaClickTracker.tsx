'use client'

import { useEffect } from 'react'
import { sendGTMEvent } from '@next/third-parties/google'

type Props = { gtmId: string | null }

export function GTMCtaClickTracker({ gtmId }: Props) {
  useEffect(() => {
    if (!gtmId) return

    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return

      const ctaElement = event.target.closest<HTMLElement>('[data-gtm-cta]')
      if (!ctaElement) return

      sendGTMEvent({
        event: 'cta_click',
        cta_name: ctaElement.dataset.gtmCta,
        cta_location: ctaElement.dataset.gtmCtaLocation ?? null,
        cta_href: ctaElement.getAttribute('href') ?? null,
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [gtmId])

  return null
}
