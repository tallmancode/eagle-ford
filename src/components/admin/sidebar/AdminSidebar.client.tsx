'use client'

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { NavPreferences } from 'payload'
import { getTranslation } from '@payloadcms/translations'
import { Link, useConfig, useTranslation } from '@payloadcms/ui'
import { EntityType, formatAdminURL, NavGroupType } from '@payloadcms/ui/shared'
import { usePathname } from 'next/navigation'
import { Home, Search } from 'lucide-react'
import { getNavIcon } from '@/components/admin/sidebar/navIconMap'
import { NavUserChip } from '@/components/admin/sidebar/NavUserChip'
import { customNavLinks } from '@/components/admin/sidebar/customNavLinks'

const GROUPS_STORAGE_KEY = 'admin-nav-collapsed-groups'

type Props = {
  groups: NavGroupType[]
  navPreferences: NavPreferences | null
}

type NavItem = {
  href: string
  id: string
  label: string
  slug: string
}

type NavGroupView = {
  id: string
  items: NavItem[]
  label: string
}

function isPathActive(pathname: string, href: string): boolean {
  return pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])
}

function shortcutLabel(): string {
  if (typeof navigator === 'undefined') return '⌘K'
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? '⌘K' : 'Ctrl+K'
}

export const AdminSidebarClient: FC<Props> = ({ groups, navPreferences }) => {
  const pathname = usePathname()
  const { i18n } = useTranslation()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const dashboardHref = formatAdminURL({ adminRoute, path: '' })
  const isDashboard = pathname.replace(/\/$/, '') === dashboardHref.replace(/\/$/, '')

  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    groups.forEach(({ label }) => {
      if (navPreferences?.groups?.[label]?.open === false) initial.add(label)
    })
    return initial
  })
  const [filter, setFilter] = useState('')
  const [kbd, setKbd] = useState('⌘K')
  const filterInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GROUPS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as unknown
        if (Array.isArray(parsed)) setCollapsedGroups(new Set(parsed.filter((v) => typeof v === 'string')))
      }
    } catch {
      /* ignore */
    }
    setKbd(shortcutLabel())
  }, [])

  const persistCollapsedGroups = useCallback((next: Set<string>) => {
    setCollapsedGroups(next)
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify([...next]))
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        filterInputRef.current?.focus()
        filterInputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const allGroups = useMemo<NavGroupView[]>(() => {
    const mapped: NavGroupView[] = groups.map(({ entities, label }) => ({
      id: label,
      label,
      items: entities.map(({ slug, type, label: entityLabel }) => {
        const href =
          type === EntityType.collection
            ? formatAdminURL({ adminRoute, path: `/collections/${slug}` })
            : formatAdminURL({ adminRoute, path: `/globals/${slug}` })

        return {
          href,
          id: type === EntityType.collection ? `nav-${slug}` : `nav-global-${slug}`,
          label: getTranslation(entityLabel, i18n),
          slug,
        }
      }),
    }))

    for (const link of customNavLinks) {
      const href = formatAdminURL({ adminRoute, path: link.href })
      const item: NavItem = {
        href,
        id: link.id,
        label: link.label,
        slug: 'live-stock',
      }
      const existing = mapped.find((group) => group.label === link.group)
      if (existing) {
        existing.items.push(item)
      } else {
        mapped.push({ id: link.group, label: link.group, items: [item] })
      }
    }

    return mapped
  }, [adminRoute, groups, i18n])

  const trimmedFilter = filter.trim().toLowerCase()

  const visibleGroups = useMemo(() => {
    return allGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          if (!trimmedFilter) return true
          return item.label.toLowerCase().includes(trimmedFilter)
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [allGroups, trimmedFilter])

  const toggleGroup = useCallback(
    (groupId: string) => {
      const next = new Set(collapsedGroups)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      persistCollapsedGroups(next)
    },
    [collapsedGroups, persistCollapsedGroups],
  )

  return (
    <div data-admin-nav="" className="admin-nav">
      <div className="admin-nav__jumpto">
        <span className="admin-nav__jumpto-icon" aria-hidden="true">
          <Search className="admin-nav__svg-icon" size={15} strokeWidth={2} />
        </span>
        <input
          ref={filterInputRef}
          type="search"
          className="admin-nav__jumpto-input"
          placeholder="Jump to…"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setFilter('')
              filterInputRef.current?.blur()
            }
          }}
          aria-label="Jump to"
        />
        <kbd className="admin-nav__jumpto-kbd" aria-hidden="true">
          {kbd}
        </kbd>
      </div>

      <Link
        href={dashboardHref}
        prefetch={false}
        className={`admin-nav__dashboard-link${isDashboard ? ' admin-nav__dashboard-link--active' : ''}`}
      >
        <Home className="admin-nav__svg-icon" size={17} strokeWidth={1.9} />
        Dashboard
      </Link>

      {visibleGroups.map((group) => {
        const isCollapsed = !trimmedFilter && collapsedGroups.has(group.id)

        return (
          <div key={group.id} className="admin-nav__group">
            <button
              type="button"
              className="admin-nav__group-title"
              onClick={() => toggleGroup(group.id)}
              aria-expanded={!isCollapsed}
            >
              <span className="admin-nav__group-title-text">{group.label}</span>
              <svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`admin-nav__group-chevron${isCollapsed ? ' admin-nav__group-chevron--collapsed' : ''}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {!isCollapsed &&
              group.items.map((item) => {
                const Icon = getNavIcon(item.slug)
                const active = isPathActive(pathname, item.href)
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    prefetch={false}
                    id={item.id}
                    className={`admin-nav__item-link${active ? ' admin-nav__item-link--active' : ''}`}
                  >
                    {Icon ? <Icon className="admin-nav__svg-icon" size={17} strokeWidth={1.9} /> : null}
                    <span className="admin-nav__item-label">{item.label}</span>
                  </Link>
                )
              })}
          </div>
        )
      })}

      {trimmedFilter && visibleGroups.length === 0 ? (
        <div className="admin-nav__no-results">No matching items</div>
      ) : null}

      <NavUserChip />
    </div>
  )
}
