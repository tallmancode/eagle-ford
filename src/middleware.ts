import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { isGarbageServerActionId } from '@/lib/sentry/rscProbeNoise'

function isRawIpHost(host: string): boolean {
  const hostname = host.split(':')[0]
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
}

function isObviousProbe(request: NextRequest): boolean {
  if (request.method !== 'POST') return false

  const host = request.headers.get('host')
  if (host && isRawIpHost(host)) return true

  const nextAction = request.headers.get('next-action')
  if (nextAction && isGarbageServerActionId(nextAction)) return true

  return false
}

export function middleware(request: NextRequest) {
  if (isObviousProbe(request)) {
    return new NextResponse(null, { status: 400 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|favicon.ico|monitoring).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
