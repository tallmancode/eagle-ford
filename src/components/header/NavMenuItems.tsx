'use client'

import Link from 'next/link'
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
import {
  generateNavHref,
  getDropdownParentHref,
  getNavLinkTarget,
} from '@/lib/fields/navigation/resolveNavHref'
import type { NavLinks } from '@/payload-types'
import { cn } from '@/utilities/ui'

type NavLink = NonNullable<NavLinks>[number]

const triggerClassName = (linkClassName?: string) =>
  cn(
    'hover:bg-transparent cursor-pointer data-[state=open]:hover:bg-transparent data-[state=open]:text-primary data-[state=open]:bg-transparent data-[state=open]:focus:bg-transparent',
    linkClassName,
  )

export const renderNavItem = (item: NavLink, index: number, linkClassName?: string) => {
  if (item.type === 'dropdown') {
    const parentHref = getDropdownParentHref(item)

    return (
      <NavigationMenuItem key={item.id ?? index}>
        <div className="flex items-center gap-0">
          {parentHref ? (
            <>
              <Link
                href={parentHref}
                target={getNavLinkTarget(item)}
                className={cn(linkClassName, 'px-4 py-2')}
              >
                {item.label}
              </Link>
              <NavigationMenuTrigger
                hideChevron
                className={cn(triggerClassName(linkClassName), 'px-1')}
                aria-label={`Open ${item.label} menu`}
              >
                <ChevronDown className="h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
              </NavigationMenuTrigger>
            </>
          ) : (
            <NavigationMenuTrigger className={triggerClassName(linkClassName)}>
              {item.label}
            </NavigationMenuTrigger>
          )}
        </div>
        <NavigationMenuContent className="bg-light-50">
          <ul className="flex flex-col min-w-[160px] p-2">
            {item.children?.map((child, childIndex) => {
              const childHref = generateNavHref(child)
              return (
                <li key={child.id ?? childIndex}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={childHref}
                      target={getNavLinkTarget(child)}
                      className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
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

  if (item.variant === 'button') {
    return (
      <NavigationMenuItem key={item.id ?? index}>
        <NavigationMenuLink asChild>
          <Button asChild variant="secondary" className="rounded-full" size="sm">
            <Link href={href} target={target}>
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
          className={cn(
            'hover:bg-transparent cursor-pointer hover:text-primary transition-colors',
            linkClassName,
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
}: {
  links?: NavLinks
  className?: string
  linkClassName?: string
}) => {
  if (!links?.length) return null

  return (
    <NavigationMenu viewport={false} className={className}>
      <NavigationMenuList className="space-x-4">
        {links.map((item, index) => renderNavItem(item, index, linkClassName))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
