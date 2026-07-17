import type { Access } from 'payload'

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
