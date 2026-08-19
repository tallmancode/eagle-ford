'use client'

import { Hamburger, useNav } from '@payloadcms/ui'
import React from 'react'

export const NavHamburger: React.FC<{ baseClass?: string }> = ({ baseClass = 'nav' }) => {
  const { navOpen, setNavOpen } = useNav()

  return (
    <button
      className={`${baseClass}__mobile-close`}
      onClick={() => setNavOpen(false)}
      tabIndex={!navOpen ? -1 : undefined}
      type="button"
    >
      <Hamburger isActive />
    </button>
  )
}
