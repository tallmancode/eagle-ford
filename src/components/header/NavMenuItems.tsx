'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { VehicleMegaMenu } from '@/components/header/VehicleMegaMenu'
import {
  generateNavHref,
  getDropdownParentHref,
  getNavLinkTarget,
} from '@/lib/fields/navigation/resolveNavHref'
import { isNavLinkActive, navLinkFocusResetClass } from '@/lib/fields/navigation/isNavLinkActive'
import type { VehicleMegaMenuData } from '@/lib/data/vehicleMegaMenuTypes'
import type { NavLinks } from '@/payload-types'
import { cn } from '@/lib/utils/cn'

type NavLink = NonNullable<NavLinks>[number]

type NavItemRenderOptions = {
  linkClassName?: string
  activeClassName?: string
  pathname: string
  vehicleMegaMenuData?: VehicleMegaMenuData | null
}

const triggerClassName = (linkClassName?: string, active?: boolean, activeClassName?: string) =>
  cn(
    navLinkFocusResetClass,
    'hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:text-primary data-[state=open]:bg-transparent data-[state=open]:focus:bg-transparent',
    linkClassName,
    active && activeClassName,
  )

const megaMenuContentClassName =
  'container !fixed !inset-x-0 !mx-auto !top-[var(--site-header-height,7.5rem)] border-0 border-t bg-background p-0 shadow-lg rounded-b-xl data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in-0 data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out-0'

function renderFlyoutTrigger(
  item: NavLink,
  { linkClassName, activeClassName, pathname }: NavItemRenderOptions,
  ariaLabel?: string,
) {
  const parentHref = getDropdownParentHref(item)
  const active = parentHref ? isNavLinkActive(pathname, parentHref) : false

  if (parentHref) {
    return (
      <NavigationMenuTrigger
        asChild
        hideChevron
        className={triggerClassName(linkClassName, active, activeClassName)}
        aria-label={ariaLabel ?? `Open ${item.label} menu`}
      >
        <Link
          href={parentHref}
          target={getNavLinkTarget(item)}
          aria-current={active ? 'page' : undefined}
        >
          {item.label}
          <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
        </Link>
      </NavigationMenuTrigger>
    )
  }

  return (
    <NavigationMenuTrigger className={triggerClassName(linkClassName)}>
      {item.label}
    </NavigationMenuTrigger>
  )
}

export const renderNavItem = (item: NavLink, index: number, options: NavItemRenderOptions) => {
  const { linkClassName, activeClassName = 'text-primary', pathname, vehicleMegaMenuData } = options

  if (item.type === 'vehicleMegaMenu' && vehicleMegaMenuData) {
    return (
      <NavigationMenuItem key={item.id ?? index}>
        {renderFlyoutTrigger(
          item,
          { linkClassName, activeClassName, pathname },
          `Open ${item.label} vehicle menu`,
        )}
        <NavigationMenuContent className={megaMenuContentClassName}>
          <VehicleMegaMenu data={vehicleMegaMenuData} />
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  if (item.type === 'dropdown') {
    return (
      <NavigationMenuItem key={item.id ?? index}>
        {renderFlyoutTrigger(item, { linkClassName, activeClassName, pathname })}
        <NavigationMenuContent className="bg-light-50">
          <ul className="flex flex-col min-w-[160px] p-2">
            {item.children?.map((child, childIndex) => {
              const childHref = generateNavHref(child)
              const childActive = isNavLinkActive(pathname, childHref)
              return (
                <li key={child.id ?? childIndex}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={childHref}
                      target={getNavLinkTarget(child)}
                      aria-current={childActive ? 'page' : undefined}
                      className={cn(
                        navLinkFocusResetClass,
                        'block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors',
                        childActive && activeClassName,
                      )}
                    >
                      {child.label}
                    </Link>
                  </NavigationMenuLink>
                </li>
              )
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  const href = generateNavHref(item)
  const target = getNavLinkTarget(item)
  const active = isNavLinkActive(pathname, href)

  if (item.variant === 'button') {
    return (
      <NavigationMenuItem key={item.id ?? index}>
        <NavigationMenuLink asChild>
          <Button asChild variant="secondary" className="rounded-full" size="sm">
            <Link href={href} target={target} aria-current={active ? 'page' : undefined}>
              {item.label}
            </Link>
          </Button>
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={item.id ?? index}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          target={target}
          aria-current={active ? 'page' : undefined}
          className={cn(
            navLinkFocusResetClass,
            'hover:bg-transparent cursor-pointer hover:text-primary transition-colors',
            linkClassName,
            active && activeClassName,
          )}
        >
          {item.label}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

export const NavMenuItems = ({
  links,
  className,
  linkClassName,
  activeClassName = 'text-primary',
  vehicleMegaMenuData,
}: {
  links?: NavLinks
  className?: string
  linkClassName?: string
  activeClassName?: string
  vehicleMegaMenuData?: VehicleMegaMenuData | null
}) => {
  const pathname = usePathname()

  if (!links?.length) return null

  return (
    <NavigationMenu viewport={false} className={className}>
      <NavigationMenuList className="space-x-4">
        {links.map((item, index) =>
          renderNavItem(item, index, {
            linkClassName,
            activeClassName,
            pathname,
            vehicleMegaMenuData,
          }),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
