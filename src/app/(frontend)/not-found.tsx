import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import notFoundImage from '@/assets/Media/error/not-found.jpg'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center relative"
      style={{
        backgroundImage: `url(${notFoundImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative z-10 px-4">
        <p className="text-xl text-white mb-8 drop-shadow-lg">This page could not be found.</p>
        <Button
          asChild
          variant="default"
          size="lg"
          className="bg-white/90 text-primary-600 hover:bg-white"
        >
          <Link href="/">Go home</Link>
        </Button>
      </div>
      <div className="absolute inset-0 bg-black/50 z-0" aria-hidden="true" />
    </div>
  )
}
