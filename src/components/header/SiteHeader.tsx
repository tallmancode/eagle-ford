import { MainNav } from '@/components/header/MainNav'
import { TopNav } from '@/components/header/TopNav'
import { Header as GlobalHeader, Setting as GlobalSettings } from '@/payload-types'

export interface HeaderNavProps {
  globalHeader: GlobalHeader
  globalSettings: GlobalSettings
}

export const SiteHeader = ({ globalHeader, globalSettings }: HeaderNavProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background shadow-bottom">
      <TopNav topNavProps={globalHeader?.topNav} settings={globalSettings}></TopNav>
      <MainNav
        headerLogo={globalHeader?.headerLogo}
        leftLinks={globalHeader?.leftLinks}
        rightLinks={globalHeader?.rightLinks}
      />
    </header>
  )
}
