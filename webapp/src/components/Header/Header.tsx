import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import React from 'react'

import { useAuthenticatedUser } from '@/features/auth'

import { Button } from '../Button'
import { Icon } from '../Icon'

import * as s from './Header.css'

export const Header = () => {
  const { currentUser, logOut } = useAuthenticatedUser()

  return (
    <header className={s.header}>
      <div className={s.searchContainer}>Search here...</div>
      <div>
        {currentUser ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost">
                <Button.Icon>
                  <Icon name="user" className={s.headerItemIcon} />
                </Button.Icon>
                {currentUser.name}
                <Button.Icon>
                  <Icon name="triangle" className={s.dropdownIcon} />
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
              <Icon name="user" className={s.headerItemIcon} />
            </Button.Icon>
            Log in
          </Button>
        )}
      </div>
    </header>
  )
}
