import { Media } from '@/components/Media'
import { Header as GlobalHeader } from '@/payload-types'
import Link from 'next/link'

export const MainNav = ({ headerLogo }: { headerLogo: GlobalHeader['headerLogo'] }) => {
  return (
    <div className="flex justify-between items-center container py-2">
      <nav className="flex space-x-4 items-center">
        <a href="#" className="text-secondary font-bold text-lg">
          New
        </a>
        <a href="#" className="text-secondary font-bold text-lg">
          Specials
        </a>
        <a href="#" className="text-secondary font-bold text-lg">
          Pre-Owned
        </a>
      </nav>
      {typeof headerLogo === 'object' && headerLogo && (
        <Link href="/" aria-label="Home">
          <Media resource={headerLogo} imgClassName="lg:w-36 w-28" priority />
        </Link>
      )}
      <nav className="flex space-x-4 items-center">
        <a href="#" className="text-secondary font-bold text-lg">
          Services
        </a>
        <a href="#" className="text-secondary font-bold text-lg">
          Sell Your Car
        </a>
        <a href="#" className="text-secondary font-bold text-lg">
          Contact Us
        </a>
      </nav>
    </div>
  )
}
