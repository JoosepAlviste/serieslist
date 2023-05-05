import React from 'react'

import { useAuthenticatedUser } from '@/features/auth'
import { Link } from '@/renderer/Link'

import logo from '../../renderer/favicon.ico'
import { Button } from '../Button'

const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: 20,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      lineHeight: '1.8em',
    }}
  >
    {children}
  </div>
)

const Logo = () => (
  <div
    style={{
      marginTop: 20,
      marginBottom: 10,
    }}
  >
    <a href="/">
      <img src={logo} height={64} width={64} alt="logo" />
    </a>
  </div>
)

export const Navbar = () => {
  const { currentUser, logOut } = useAuthenticatedUser()

  return (
    <Sidebar>
      <Logo />
      <Link className="navitem" href="/">
        Home
      </Link>
      <Link className="navitem" href="/about">
        About
      </Link>
      {currentUser ? (
        <Button onClick={logOut}>Log out</Button>
      ) : (
        <>
          <Link className="navitem" href="/login">
            Log in
          </Link>
          <Link className="navitem" href="/register">
            Register
          </Link>
        </>
      )}
    </Sidebar>
  )
}
