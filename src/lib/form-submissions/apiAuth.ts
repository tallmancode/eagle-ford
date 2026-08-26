import { timingSafeEqual } from 'node:crypto'

/** Auth: Authorization: Bearer <FORM_SUBMISSIONS_API_KEY> */
export function isFormSubmissionsApiAuthorized(request: Request): boolean {
  const secret = process.env.FORM_SUBMISSIONS_API_KEY
  if (!secret) return false

  const header = request.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return false

  const token = header.slice('Bearer '.length)
  const expected = Buffer.from(secret)
  const actual = Buffer.from(token)

  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}
