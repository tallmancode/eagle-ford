import { MainNav } from '@/components/header/MainNav'
import { TopNav } from '@/components/header/TopNav'
import type { VehicleMegaMenuData } from '@/lib/data/vehicleMegaMenuTypes'
import { Header as GlobalHeader, Setting as GlobalSettings } from '@/payload-types'

export interface HeaderNavProps {
  globalHeader: GlobalHeader
  globalSettings: GlobalSettings
  vehicleMegaMenuData?: VehicleMegaMenuData | null
}

export const SiteHeader = ({
  globalHeader,
  globalSettings,
  vehicleMegaMenuData,
}: HeaderNavProps) => {
  return (
    <header className="sticky top-0 z-75 bg-background shadow-bottom [--site-header-height:7.5rem]">
      <TopNav topNavProps={globalHeader?.topNav} settings={globalSettings}></TopNav>
      <MainNav
        headerLogo={globalHeader?.headerLogo}
        leftLinks={globalHeader?.leftLinks}
        rightLinks={globalHeader?.rightLinks}
        settings={globalSettings}
        vehicleMegaMenuData={vehicleMegaMenuData}
      />
    </header>
  )
}
