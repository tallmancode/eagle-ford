import Link from 'next/link'
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

type NavLink = NonNullable<NavLinks>[number]

export const renderNavItem = (item: NavLink, index: number, linkClassName?: string) => {
  if (item.type === 'dropdown') {
    const parentHref = getDropdownParentHref(item)

    return (
      <NavigationMenuItem key={item.id ?? index}>
        <NavigationMenuTrigger className={linkClassName}>
          {parentHref ? (
            <Link href={parentHref} target={getNavLinkTarget(item)}>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </NavigationMenuTrigger>
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
        <Link href={href} target={target} className={linkClassName}>
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
    <NavigationMenu className={className}>
      <NavigationMenuList className="space-x-2">
        {links.map((item, index) => renderNavItem(item, index, linkClassName))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
