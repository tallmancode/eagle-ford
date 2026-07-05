'use client'

import { useEffect, useState, type ComponentProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Plus, type LucideIcon } from 'lucide-react'

import { Media } from '@/components/Media'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  generateNavHref,
  getDropdownParentHref,
  getNavLinkTarget,
} from '@/lib/fields/navigation/resolveNavHref'
import type { Header as GlobalHeader, NavLinks } from '@/payload-types'
import { cn } from '@/utilities/ui'

type NavLink = NonNullable<NavLinks>[number]
type NavLinkChild = NonNullable<NonNullable<NavLink['children']>[number]>

type MobileNavProps = {
  links?: NavLinks
  logo: GlobalHeader['headerLogo']
  className?: string
}

const mobileMenuTriggerClass = cn(
  buttonVariants({ variant: 'ghost', size: 'icon' }),
  'text-secondary hover:text-secondary',
)

const mobileLinkClass = 'text-2xl font-semibold text-secondary'

export const MobileNav = ({ links, logo, className }: MobileNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  if (!links?.length) return null

  return (
    <div className={className}>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger className={mobileMenuTriggerClass} aria-label="Open navigation menu">
          <Menu className="size-8" aria-hidden="true" />
        </SheetTrigger>
        <SheetContent className="overflow-y-auto data-[side=right]:w-full data-[side=right]:border-0 bg-light-50/75">
          <SheetHeader>
            <SheetTitle>
              {typeof logo === 'object' && logo && (
                <Link
                  href="/"
                  className="flex items-center gap-2 max-w-3/4"
                  aria-label="Home"
                  onClick={closeMobileMenu}
                >
                  <Media resource={logo} imgClassName="h-auto w-auto max-h-8 object-contain" />
                </Link>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 p-4 flex-1">
            <Accordion type="multiple" className="flex w-full flex-col gap-4">
              {links.map((link, index) => renderMobileMenuItem(link, index, closeMobileMenu))}
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

type MobileAccordionTriggerProps = ComponentProps<typeof AccordionTrigger> & {
  icon?: LucideIcon
}

function MobileAccordionTrigger({
  icon: Icon = Plus,
  className,
  children,
  ...props
}: MobileAccordionTriggerProps) {
  return (
    <AccordionTrigger className={cn('group [&>svg:last-child]:hidden', className)} {...props}>
      {children}
      <Icon
        aria-hidden
        className="pointer-events-none size-8 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-45 text-secondary"
      />
    </AccordionTrigger>
  )
}

const renderMobileMenuItem = (item: NavLink, index: number, onNavigate: () => void) => {
  if (item.type === 'dropdown') {
    const parentHref = getDropdownParentHref(item)

    return (
      <AccordionItem
        key={item.id ?? index}
        value={item.label ?? String(item.id ?? index)}
        className="border-b-0"
      >
        {parentHref ? (
          <div className="flex w-full items-center justify-between gap-2">
            <Link
              href={parentHref}
              target={getNavLinkTarget(item)}
              className={mobileLinkClass}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
            <MobileAccordionTrigger
              className="w-auto shrink-0 py-0 px-2 font-semibold no-underline hover:no-underline size-8"
              aria-label={`Expand ${item.label} submenu`}
            />
          </div>
        ) : (
          <MobileAccordionTrigger
            className={cn(mobileLinkClass, 'py-0 no-underline hover:no-underline')}
          >
            {item.label}
          </MobileAccordionTrigger>
        )}
        <AccordionContent className="mt-2 [&_a]:no-underline">
          {item.children?.map((subItem, childIndex) => (
            <SubMenuLink key={subItem.id ?? childIndex} item={subItem} onNavigate={onNavigate} />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  const href = generateNavHref(item)
  const target = getNavLinkTarget(item)

  if (item.variant === 'button') {
    return (
      <Button
        key={item.id ?? index}
        asChild
        variant="secondary"
        className="rounded-full my-2"
        size="sm"
      >
        <Link href={href} target={target} onClick={onNavigate}>
          {item.label}
        </Link>
      </Button>
    )
  }

  return (
    <Link
      key={item.id ?? index}
      href={href}
      target={target}
      className={cn(mobileLinkClass, 'my-2 block')}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  )
}

const SubMenuLink = ({ item, onNavigate }: { item: NavLinkChild; onNavigate: () => void }) => {
  return (
    <Link
      href={generateNavHref(item)}
      target={getNavLinkTarget(item)}
      className="flex min-w-0 flex-row p-3 no-underline text-secondary"
      onClick={onNavigate}
    >
      <div className="text-xl font-semibold">{item.label}</div>
    </Link>
  )
}
