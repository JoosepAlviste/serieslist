import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import React from 'react'

import { Link } from '@/components'

import { LogoIcon, SeriesIcon } from '../Icons'

import * as s from './NavSidebar.css'

export const Navbar = () => (
  <NavigationMenu.Root orientation="vertical">
    <NavigationMenu.List className={s.container}>
      <NavigationMenu.Item className={s.navItemLogo}>
        <NavigationMenu.Link href="/" className={s.navLinkLogo}>
          <LogoIcon className={s.navIconLogo} aria-label="Home" />
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/about" className={s.navLink} asChild>
          <Link activeClass={s.navLinkIsActive}>
            <SeriesIcon className={s.navIcon} aria-label="Series" />
          </Link>
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
)
