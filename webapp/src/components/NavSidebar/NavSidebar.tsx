import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import React from 'react'

import { Link, Tooltip } from '@/components'

import { Icon } from '../Icon'

import * as s from './NavSidebar.css'

export const NavSidebar = () => (
  <NavigationMenu.Root orientation="vertical">
    <NavigationMenu.List className={s.container}>
      <Tooltip text="Home" side="right">
        <NavigationMenu.Item className={s.navItemLogo}>
          <NavigationMenu.Link href="/" className={s.navLinkLogo}>
            <Icon name="logo" size="l" label="Home" />
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </Tooltip>

      <Tooltip text="My series list" side="right">
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/about" className={s.navLink} asChild>
            <Link activeClass={s.navLinkIsActive}>
              <Icon name="series" size="l" label="Series" />
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </Tooltip>
    </NavigationMenu.List>
  </NavigationMenu.Root>
)
