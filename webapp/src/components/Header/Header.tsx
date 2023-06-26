import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import classNames from 'classnames'
import React, { useState } from 'react'

import { useAuthenticatedUser } from '@/features/auth'
import { Search } from '@/features/search'

import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { Logo } from '../Logo'
import { ThemeToggle } from '../ThemeToggle'

import * as s from './Header.css'
import { MenuTrigger } from './MenuTrigger'
import { MobileMenu } from './MobileMenu'

type HeaderProps = {
  className?: string
}

export const Header = ({ className }: HeaderProps) => {
  const { currentUser, logOut } = useAuthenticatedUser()

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={classNames(s.header, className)}>
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
                  <Icon name="user" label="Current User" />
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
          <Button href="/login" variant="ghost">
            <Button.Icon>
              <Icon name="user" aria-hidden />
            </Button.Icon>
            Log in
          </Button>
        )}
      </div>

      <div className={s.mobileOnly}>
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <Logo />
        </Link>
      </div>

      <MenuTrigger
        className={s.mobileOnly}
        isActive={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      />

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  )
}
