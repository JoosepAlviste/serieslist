import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import React from 'react'

import { useAuthenticatedUser } from '@/features/auth'
import { Search } from '@/features/search'

import { Button } from '../Button'
import { Icon } from '../Icon'
import { ThemeToggle } from '../ThemeToggle'

import * as s from './Header.css'

export const Header = () => {
  const { currentUser, logOut } = useAuthenticatedUser()

  return (
    <header className={s.header}>
      <div className={s.searchContainer}>
        <Search className={s.search} />
      </div>
      <div className={s.headerRight}>
        <ThemeToggle />

        {currentUser ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost">
                <Button.Icon>
                  <Icon
                    name="user"
                    label="Current User"
                    className={s.headerItemIcon}
                  />
                </Button.Icon>
                {currentUser.name}
                <Button.Icon>
                  <Icon
                    name="triangle"
                    label="Expand"
                    size="s"
                    className={s.dropdownIcon}
                  />
                </Button.Icon>
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className={s.dropdownContent}>
                <DropdownMenu.Item onSelect={logOut} className={s.dropdownItem}>
                  Log out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <Button
            href="/login"
            className={s.headerItemContainer}
            variant="ghost"
          >
            <Button.Icon>
              <Icon name="user" aria-hidden className={s.headerItemIcon} />
            </Button.Icon>
            Log in
          </Button>
        )}
      </div>
    </header>
  )
}
