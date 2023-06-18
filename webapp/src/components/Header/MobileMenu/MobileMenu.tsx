import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import React, { useRef } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Icon, Link } from '@/components'
import { GITHUB_URL } from '@/constants'
import { useAuthenticatedUser } from '@/features/auth'
import { Search } from '@/features/search'

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
                <Link className={s.link}>My series list</Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          )}

          {currentUser ? (
            <NavigationMenu.Item>
              <NavigationMenu.Link
                asChild
                onSelect={async () => {
                  onClose()
                  await logOut()
                }}
              >
                <button className={s.link} type="button">
                  Log out
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
