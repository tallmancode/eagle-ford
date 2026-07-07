'use client'

import * as React from 'react'
import { ChevronUp } from 'lucide-react'

import { Button } from '@/lib/components/ui/button'
import { cn } from '@/lib/utils/cn'

const SCROLL_THRESHOLD = 400

export const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-4 left-5 md:left-8 z-50 rounded-full shadow-card transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none',
      )}
    >
      <ChevronUp />
      <span className="sr-only">Back to top</span>
    </Button>
  )
}
