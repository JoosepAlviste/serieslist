import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { Icon, Link, Text } from '@serieslist/ui'
import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { GITHUB_URL } from '#/constants'
import { useAuthenticatedUser } from '#/features/auth'
import { Search } from '#/features/search'

import { ThemeToggle } from '../../ThemeToggle'

import * as s from './MobileMenu.css'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { currentUser, logOut } = useAuthenticatedUser()

  const menuRef = useRef<HTMLDivElement | null>(null)

  return (
    <CSSTransition
      nodeRef={menuRef}
      in={isOpen}
      timeout={200}
      classNames={{
        enter: s.mobileMenuEnter,
        enterActive: s.mobileMenuEnterActive,
        exit: s.mobileMenuExit,
        exitActive: s.mobileMenuExitActive,
      }}
      unmountOnExit
    >
      <NavigationMenu.Root ref={menuRef} className={s.mobileMenu}>
        <Search hideKeyboardShortcuts onResultSelected={onClose} />

        <NavigationMenu.List className={s.list}>
          {currentUser && (
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/series/list/in-progress"
                asChild
                onSelect={onClose}
              >
                <Link>
                  <Text size="l" variant="secondary" className={s.link}>
                    My series list
                  </Text>
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          )}

          <NavigationMenu.Item>
            <NavigationMenu.Link href="/about" asChild onSelect={onClose}>
              <Link>
                <Text size="l" variant="secondary" className={s.link}>
                  About
                </Text>
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>

          {currentUser ? (
            <NavigationMenu.Item>
              <NavigationMenu.Link
                asChild
                onSelect={async () => {
                  onClose()
                  await logOut()
                }}
              >
                <button type="button">
                  <Text size="l" variant="secondary" className={s.link}>
                    Log out
                  </Text>
                </button>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item>
              <NavigationMenu.Link href="/login" asChild onSelect={onClose}>
                <Link className={s.link}>Log in</Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          )}

          <div className={s.separator} />

          <li className={s.footer}>
            <a
              href={GITHUB_URL}
              className={s.link}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size="l" label="GitHub" />
            </a>

            <ThemeToggle />
          </li>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </CSSTransition>
  )
}
