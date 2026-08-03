import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export function isPayloadUser(user: unknown): user is User {
  return (
    typeof user === 'object' &&
    user !== null &&
    'collection' in user &&
    (user as { collection?: string | null }).collection === 'users'
  )
}

export const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin') as boolean
}

export const isAnyone: Access = () => true

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const isAuthenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}

export const isDeveloper: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('developer'))
}

export const isAdminOrDeveloper: Access = ({ req: { user } }) => {
  if (!user) return false
  return Boolean(user.roles?.includes('admin') || user.roles?.includes('developer'))
}

/** Admin/developer can update any user; others may only update themselves. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.roles?.includes('admin') || user.roles?.includes('developer')) return true
  return { id: { equals: user.id } }
}

export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminOrDeveloperField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('developer'))
}
