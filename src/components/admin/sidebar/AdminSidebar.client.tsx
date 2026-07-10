'use client'
import { FC, Fragment } from 'react'
import type { NavPreferences } from 'payload'
import { getTranslation } from '@payloadcms/translations'
import { Link, NavGroup, useConfig, useTranslation } from '@payloadcms/ui'
import { EntityType, formatAdminURL, NavGroupType } from '@payloadcms/ui/shared'
import { usePathname } from 'next/navigation'
import { customNavLinks } from '@/components/admin/sidebar/customNavLinks'

const baseClass = 'nav'

type Props = {
  groups: NavGroupType[]
  navPreferences: NavPreferences | null
}

export const AdminSidebarClient: FC<Props> = ({ groups, navPreferences }) => {
  const pathname = usePathname()
  const { i18n } = useTranslation()

  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  return (
    <Fragment>
      {groups.map(({ entities, label }, key) => {
        const groupCustomLinks = customNavLinks.filter((link) => link.group === label)

        return (
          <NavGroup isOpen={navPreferences?.groups?.[label]?.open} key={key} label={label}>
            {entities.map(({ slug, type, label: entityLabel }, i) => {
              let href: string
              let id: string

              if (type === EntityType.collection) {
                href = formatAdminURL({ adminRoute, path: `/collections/${slug}` })
                id = `nav-${slug}`
              } else {
                href = formatAdminURL({ adminRoute, path: `/globals/${slug}` })
                id = `nav-global-${slug}`
              }

              const isActive =
                pathname.startsWith(href) && ['/', undefined].includes(pathname[href.length])

              const linkLabel = (
                <>
                  {isActive && <div className={`${baseClass}__link-indicator`} />}
                  <span className={`${baseClass}__link-label`}>
                    {getTranslation(entityLabel, i18n)}
                  </span>
                </>
              )

              if (pathname === href) {
                return (
                  <div className={`${baseClass}__link`} id={id} key={i}>
                    {linkLabel}
                  </div>
                )
              }

              return (
                <Link className={`${baseClass}__link`} href={href} id={id} key={i} prefetch={false}>
                  {linkLabel}
                </Link>
              )
            })}
            {groupCustomLinks.map((link) => {
              const href = formatAdminURL({ adminRoute, path: link.href })
              const isActive = pathname === href || pathname.startsWith(`${href}/`)

              const linkLabel = (
                <>
                  {isActive && <div className={`${baseClass}__link-indicator`} />}
                  <span className={`${baseClass}__link-label`}>{link.label}</span>
                </>
              )

              if (pathname === href) {
                return (
                  <div className={`${baseClass}__link`} id={link.id} key={link.id}>
                    {linkLabel}
                  </div>
                )
              }

              return (
                <Link
                  className={`${baseClass}__link`}
                  href={href}
                  id={link.id}
                  key={link.id}
                  prefetch={false}
                >
                  {linkLabel}
                </Link>
              )
            })}
          </NavGroup>
        )
      })}
    </Fragment>
  )
}
