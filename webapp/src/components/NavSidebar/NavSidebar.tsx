import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import classNames from 'classnames'
import React from 'react'

import { Link, Tooltip } from '@/components'
import { useAuthenticatedUser } from '@/features/auth'

import { Icon } from '../Icon'

import * as s from './NavSidebar.css'

type NavSidebarProps = {
  className?: string
}

export const NavSidebar = ({ className }: NavSidebarProps) => {
  const { currentUser } = useAuthenticatedUser()

  return (
    <NavigationMenu.Root
      orientation="vertical"
      className={classNames(className)}
    >
      <NavigationMenu.List className={s.container}>
        <Tooltip text="Home" side="right">
          <NavigationMenu.Item className={s.navItemLogo}>
            <NavigationMenu.Link href="/" className={s.navLinkLogo}>
              <Icon name="logo" size="l" label="Home" />
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Tooltip>

        {currentUser && (
          <Tooltip text="My series list" side="right">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/series/list"
                className={s.navLink}
                asChild
              >
                <Link activeClass={s.navLinkIsActive}>
                  <Icon name="series" size="l" label="Series" />
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </Tooltip>
        )}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
