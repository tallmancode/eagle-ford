import type { Access, FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export type UserRole = NonNullable<User['roles']>[number]

export function isPayloadUser(user: unknown): user is User {
  return (
    typeof user === 'object' &&
    user !== null &&
    'collection' in user &&
    (user as { collection?: string | null }).collection === 'users'
  )
}

/** Roles from a Payload user or admin ClientUser. */
export function getUserRoles(user: unknown): string[] | null {
  if (!user || typeof user !== 'object' || !('roles' in user)) return null
  const roles = (user as { roles?: unknown }).roles
  return Array.isArray(roles) ? (roles as string[]) : null
}

export function hasRole(user: unknown, role: UserRole | string): boolean {
  return Boolean(getUserRoles(user)?.includes(role))
}

export function isElevated(user: unknown): boolean {
  return hasRole(user, 'admin') || hasRole(user, 'developer')
}

/** True when the user has call-center and is not admin/developer. */
export function isCallCenter(user: unknown): boolean {
  return hasRole(user, 'call-center') && !isElevated(user)
}

export const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.roles?.includes('admin') as boolean
}

export const isAnyone: Access = () => true

export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/** Authenticated users except restricted call-center (elevated always allowed). */
export const isAuthenticatedNotCallCenter: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isCallCenter(user)) return false
  return true
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

/**
 * Call-center may only read themselves; other authenticated users may read all users.
 * Elevated users are not treated as call-center.
 */
export const isAuthenticatedUsersRead: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isCallCenter(user)) return { id: { equals: user.id } }
  return true
}

export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin'))
}

export const isAdminOrDeveloperField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('admin') || user?.roles?.includes('developer'))
}
