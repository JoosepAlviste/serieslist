import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import classNames from 'classnames'
import React from 'react'

import { Link, Tooltip } from '#/components'
import { GITHUB_URL } from '#/constants'
import { useAuthenticatedUser } from '#/features/auth'

import { Icon } from '../Icon'
import { Logo } from '../Logo'

import * as s from './NavSidebar.css'

type NavSidebarProps = {
  className?: string
}

export const NavSidebar = ({ className }: NavSidebarProps) => {
  const { currentUser } = useAuthenticatedUser()

  return (
    <NavigationMenu.Root
      orientation="vertical"
      className={classNames(s.container, className)}
    >
      <NavigationMenu.List className={s.list}>
        <Tooltip text="Home" side="right">
          <NavigationMenu.Item className={s.navItemLogo}>
            <NavigationMenu.Link href="/">
              <Logo />
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Tooltip>

        {currentUser && (
          <Tooltip text="My series list" side="right">
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/series/list/in-progress"
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

        <div className={s.spacer} />

        <Tooltip text="About" side="right">
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/about" className={s.navLink} asChild>
              <Link activeClass={s.navLinkIsActive}>
                <Icon name="about" size="l" label="About" />
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Tooltip>

        <Tooltip text="Check out the code on GitHub" side="right">
          <NavigationMenu.Item>
            <NavigationMenu.Link
              href={GITHUB_URL}
              className={s.navLink}
              target="_blank"
            >
              <Icon name="github" size="l" label="GitHub" />
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Tooltip>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
