'use client'

import React, { useEffect } from 'react'
import { useAuth, useConfig } from '@payloadcms/ui'
import { formatAdminURL } from '@payloadcms/ui/shared'
import './nav-user-chip.css'

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

function hideHeaderAccountLink() {
  document.querySelectorAll<HTMLElement>('a.app-header__account').forEach((el) => {
    el.style.setProperty('display', 'none', 'important')
    el.setAttribute('hidden', '')
    el.setAttribute('aria-hidden', 'true')
    el.setAttribute('tabindex', '-1')
  })
}

export const NavUserChip: React.FC = () => {
  const { user } = useAuth<NavUser>()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  useEffect(() => {
    hideHeaderAccountLink()
    const header = document.querySelector('.app-header')
    if (!header) return

    const observer = new MutationObserver(hideHeaderAccountLink)
    observer.observe(header, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  if (!user) return null

  const displayName = displayNameFor(user)
  const initials = initialsFor(displayName)
  const accountHref = formatAdminURL({ adminRoute, path: '/account' })

  return (
    <div className="admin-nav__user">
      <a href={accountHref} className="admin-nav__user-trigger" aria-label="Account">
        <span className="admin-nav__user-avatar" aria-hidden="true">
          {initials || '?'}
        </span>
        <span className="admin-nav__user-info">
          <span className="admin-nav__user-name">{displayName}</span>
          {user.email && displayName !== user.email ? (
            <span className="admin-nav__user-status">{user.email}</span>
          ) : null}
        </span>
      </a>
    </div>
  )
}
