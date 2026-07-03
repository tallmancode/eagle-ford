import { Media } from '@/components/Media'
import { NavMenuItems } from '@/components/header/NavMenuItems'
import { Header as GlobalHeader } from '@/payload-types'
import Link from 'next/link'

type MainNavProps = {
  headerLogo: GlobalHeader['headerLogo']
  leftLinks?: GlobalHeader['leftLinks']
  rightLinks?: GlobalHeader['rightLinks']
}

export const MainNav = ({ headerLogo, leftLinks, rightLinks }: MainNavProps) => {
  return (
    <div className="flex justify-between items-center container py-2">
      <NavMenuItems
        links={leftLinks}
        className="flex space-x-4 items-center"
        linkClassName="text-secondary font-bold text-sm"
      />
      {typeof headerLogo === 'object' && headerLogo && (
        <Link href="/" aria-label="Home">
          <Media resource={headerLogo} imgClassName="lg:w-36 w-28" priority />
        </Link>
      )}
      <NavMenuItems
        links={rightLinks}
        className="flex space-x-4 items-center"
        linkClassName="text-secondary font-bold text-sm"
      />
    </div>
  )
}
