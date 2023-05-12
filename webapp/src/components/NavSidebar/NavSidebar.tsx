import React from 'react'

import { Link } from '@/components'

import { LogoIcon, SeriesIcon } from '../Icons'

import * as s from './NavSidebar.css'

export const Navbar = () => (
  <nav className={s.container}>
    <a href="/" className={s.navItemLogo}>
      <LogoIcon className={s.navItemIconLogo} aria-label="Home" />
    </a>

    <Link className={s.navItem} activeClass={s.navItemIsActive} href="/about">
      <SeriesIcon className={s.navItemIcon} />
    </Link>
  </nav>
)
