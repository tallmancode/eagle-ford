'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'

type NavUser = {
  email?: string
  firstName?: string
  lastName?: string
  username?: string
}

function displayNameFor(user: NavUser): string {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
  return fullName || user.username || user.email || 'User'
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const NavUserChip: React.FC = () => {
  const { user } = useAuth<NavUser>()

  if (!user) return null

  const displayName = displayNameFor(user)
  const initials = initialsFor(displayName)

  return (
    <div className="admin-nav__user">
      <div className="admin-nav__user-trigger">
        <span className="admin-nav__user-avatar" aria-hidden="true">
          {initials || '?'}
        </span>
        <span className="admin-nav__user-info">
          <span className="admin-nav__user-name">{displayName}</span>
          {user.email && displayName !== user.email ? (
            <span className="admin-nav__user-status">{user.email}</span>
          ) : null}
        </span>
      </div>
    </div>
  )
}
