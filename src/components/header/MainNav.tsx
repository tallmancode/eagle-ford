import { Media } from '@/components/Media'
import { MobileNav } from '@/components/header/MobileNav'
import { NavMenuItems } from '@/components/header/NavMenuItems'
import type { VehicleMegaMenuData } from '@/lib/data/vehicleMegaMenuTypes'
import { Header as GlobalHeader, Setting as GlobalSettings } from '@/payload-types'
import Link from 'next/link'

type MainNavProps = {
  headerLogo: GlobalHeader['headerLogo']
  leftLinks?: GlobalHeader['leftLinks']
  rightLinks?: GlobalHeader['rightLinks']
  settings: GlobalSettings
  vehicleMegaMenuData?: VehicleMegaMenuData | null
}

export const MainNav = ({
  headerLogo,
  leftLinks,
  rightLinks,
  settings,
  vehicleMegaMenuData,
}: MainNavProps) => {
  const mobileLinks = [...(leftLinks ?? []), ...(rightLinks ?? [])]

  return (
    <div className="relative flex justify-between items-center container py-2">
      <div className="flex items-center lg:flex-1">
        <NavMenuItems
          links={leftLinks}
          className="hidden lg:flex space-x-4 items-center"
          linkClassName="text-secondary font-bold text-sm"
          vehicleMegaMenuData={vehicleMegaMenuData}
        />
      </div>
      {typeof headerLogo === 'object' && headerLogo && (
        <Link href="/" aria-label="Home" className="absolute left-0  lg:static lg:translate-x-0">
          <Media resource={headerLogo} imgClassName="lg:w-36 w-32" priority />
        </Link>
      )}
      <div className="flex items-center justify-end lg:flex-1">
        <NavMenuItems
          links={rightLinks}
          className="hidden lg:flex space-x-4 items-center"
          linkClassName="text-secondary font-bold text-sm"
          vehicleMegaMenuData={vehicleMegaMenuData}
        />
        <MobileNav
          links={mobileLinks}
          logo={headerLogo}
          settings={settings}
          vehicleMegaMenuData={vehicleMegaMenuData}
          className="lg:hidden flex items-center justify-end w-full"
        />
      </div>
    </div>
  )
}
