'use client'

import { useEffect, useState, type ComponentProps } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, PhoneCall, Plus, type LucideIcon } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import {
  generateNavHref,
  getDropdownParentHref,
  getNavLinkTarget,
} from '@/lib/fields/navigation/resolveNavHref'
import { isNavLinkActive, navLinkFocusResetClass } from '@/lib/fields/navigation/isNavLinkActive'
import { VehicleMegaMenuMobile } from '@/components/header/VehicleMegaMenuMobile'
import type { VehicleMegaMenuData } from '@/lib/data/vehicleMegaMenuTypes'
import { formatContactAddress } from '@/lib/utils/formatContactAddress'
import type { Header as GlobalHeader, NavLinks, Setting } from '@/payload-types'
import { formatPhoneNumber } from '@/lib/utils/formatPhoneNumber'
import { cn } from '@/lib/utils/cn'

type NavLink = NonNullable<NavLinks>[number]
type NavLinkChild = NonNullable<NonNullable<NavLink['children']>[number]>

type MobileNavProps = {
  links?: NavLinks
  logo: GlobalHeader['headerLogo']
  settings: Setting
  className?: string
  vehicleMegaMenuData?: VehicleMegaMenuData | null
}

const mobileMenuTriggerClass = cn(
  buttonVariants({ variant: 'ghost', size: 'icon' }),
  'text-dark-800 hover:text-secondary',
)

const mobileLinkClass = cn(navLinkFocusResetClass, 'text-2xl font-semibold text-secondary')
const mobileActiveClass = 'text-primary'

const mobileNavSurfaceClass =
  'bg-light-50/70 backdrop-blur-md supports-[backdrop-filter]:bg-light-50/75'

function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-8" aria-hidden>
      <span
        className={cn(
          'absolute left-1/2 top-[6px] block h-0.5 w-6 -translate-x-1/2 bg-current transition-all duration-300',
          open && 'top-1/2 -translate-y-1/2 rotate-45',
        )}
      />
      <span
        className={cn(
          'absolute left-1/2 top-1/2 block h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 bg-current transition-all duration-300',
          open && 'scale-0 opacity-0',
        )}
      />
      <span
        className={cn(
          'absolute bottom-[6px] left-1/2 block h-0.5 w-6 -translate-x-1/2 bg-current transition-all duration-300',
          open && 'bottom-1/2 translate-y-1/2 -rotate-45',
        )}
      />
    </span>
  )
}

function MobileNavContactFooter({ settings }: { settings: Setting }) {
  const address = settings?.contactInfo?.address
  const addressLine = formatContactAddress(address)
  const phone = settings?.contactInfo?.phone

  if (!addressLine && !phone) return null

  return (
    <footer className={cn('shrink-0 border-t border-border px-4 py-4')}>
      <div className="flex flex-col gap-3 text-sm text-primary text-center font-bold">
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, '')}`}
            className="flex items-center justify-center gap-2"
          >
            <PhoneCall className="size-4 shrink-0" />
            <span>{formatPhoneNumber(phone)}</span>
          </a>
        )}
        {addressLine &&
          (address?.mapsLink ? (
            <a
              href={address.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center"
            >
              <MapPin className="size-4 shrink-0" />
              <span>{addressLine}</span>
            </a>
          ) : (
            <div className="flex items-center gap-2 justify-center">
              <MapPin className="size-4 shrink-0" />
              <span>{addressLine}</span>
            </div>
          ))}
      </div>
    </footer>
  )
}

export const MobileNav = ({ links, className, settings, vehicleMegaMenuData }: MobileNavProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])
  const pathname = usePathname()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  if (!links?.length) return null

  return (
    <div className={className}>
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={mobileMenuTriggerClass}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <MenuToggleIcon open={mobileMenuOpen} />
        </Button>
        <SheetContent
          overlayClassName="bg-transparent"
          className={cn(
            'flex flex-col gap-0 p-0 bottom-0 h-[calc(100dvh-56px)]',
            'data-[side=right]:w-full w-full data-[side=right]:border-0',
            'top-[56px] [&>button.absolute]:hidden',
            mobileNavSurfaceClass,
          )}
        >
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <Accordion
              type="multiple"
              className="flex w-full flex-col gap-4"
              value={openSections}
              onValueChange={setOpenSections}
            >
              {links.map((link, index) =>
                renderMobileMenuItem(link, index, closeMobileMenu, pathname, vehicleMegaMenuData),
              )}
            </Accordion>
          </div>
          <MobileNavContactFooter settings={settings} />
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

const renderMobileMenuItem = (
  item: NavLink,
  index: number,
  onNavigate: () => void,
  pathname: string,
  vehicleMegaMenuData?: VehicleMegaMenuData | null,
) => {
  if (item.type === 'vehicleMegaMenu' && vehicleMegaMenuData) {
    return (
      <AccordionItem
        key={item.id ?? index}
        value={item.label ?? String(item.id ?? index)}
        className="border-b-0"
      >
        <MobileAccordionTrigger
          className={cn(mobileLinkClass, 'py-0 no-underline hover:no-underline')}
        >
          {item.label}
        </MobileAccordionTrigger>
        <AccordionContent className="pt-2">
          <VehicleMegaMenuMobile data={vehicleMegaMenuData} onNavigate={onNavigate} />
        </AccordionContent>
      </AccordionItem>
    )
  }

  if (item.type === 'dropdown') {
    const parentHref = getDropdownParentHref(item)
    const parentActive = parentHref ? isNavLinkActive(pathname, parentHref) : false

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
              aria-current={parentActive ? 'page' : undefined}
              className={cn(mobileLinkClass, parentActive && mobileActiveClass)}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
            <MobileAccordionTrigger
              className={cn(
                navLinkFocusResetClass,
                'w-auto shrink-0 py-0 px-2 font-semibold no-underline hover:no-underline size-8',
              )}
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
        <AccordionContent className="pt-2 [&_a]:no-underline">
          {item.children?.map((subItem, childIndex) => (
            <SubMenuLink
              key={subItem.id ?? childIndex}
              item={subItem}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  const href = generateNavHref(item)
  const target = getNavLinkTarget(item)
  const active = isNavLinkActive(pathname, href)

  if (item.variant === 'button') {
    return (
      <Button
        key={item.id ?? index}
        asChild
        variant="secondary"
        className="rounded-full my-2"
        size="sm"
      >
        <Link
          href={href}
          target={target}
          aria-current={active ? 'page' : undefined}
          onClick={onNavigate}
        >
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
      aria-current={active ? 'page' : undefined}
      className={cn(mobileLinkClass, 'my-2 block', active && mobileActiveClass)}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  )
}

const SubMenuLink = ({
  item,
  pathname,
  onNavigate,
}: {
  item: NavLinkChild
  pathname: string
  onNavigate: () => void
}) => {
  const href = generateNavHref(item)
  const active = isNavLinkActive(pathname, href)

  return (
    <Link
      href={href}
      target={getNavLinkTarget(item)}
      aria-current={active ? 'page' : undefined}
      className={cn(
        navLinkFocusResetClass,
        'flex min-w-0 flex-row p-3 no-underline text-secondary',
        active && mobileActiveClass,
      )}
      onClick={onNavigate}
    >
      <div className="text-xl font-semibold">{item.label}</div>
    </Link>
  )
}
