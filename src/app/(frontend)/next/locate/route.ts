import { resolveVisitorGdprStatus } from '@/lib/privacy/gdprLocate'

export function GET(req: Request) {
  const { country, isGDPR } = resolveVisitorGdprStatus(req.headers)

  return new Response(JSON.stringify({ country, isGDPR }))
}
