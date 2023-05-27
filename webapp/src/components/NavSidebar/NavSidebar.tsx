import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import React from 'react'

import { Link } from '@/components'

import { Icon } from '../Icon'

import * as s from './NavSidebar.css'

export const NavSidebar = () => (
  <NavigationMenu.Root orientation="vertical">
    <NavigationMenu.List className={s.container}>
      <NavigationMenu.Item className={s.navItemLogo}>
        <NavigationMenu.Link href="/" className={s.navLinkLogo}>
          <Icon name="logo" size="l" className={s.navIconLogo} label="Home" />
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/about" className={s.navLink} asChild>
          <Link activeClass={s.navLinkIsActive}>
            <Icon name="series" size="l" label="Series" />
          </Link>
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
)
