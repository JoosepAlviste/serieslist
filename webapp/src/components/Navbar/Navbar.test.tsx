import { screen } from '@testing-library/react'
import React from 'react'

import { userFactory } from '@/features/users'
import { render } from '@/lib/testUtils'

import { Navbar } from './Navbar'

describe('components/Navbar', () => {
  it('renders log in and redister links if there is no logged in user', async () => {
    await render(<Navbar />, {
      authenticatedUser: null,
    })

    screen.getByText('Log in')
    screen.getByText('Register')
  })

  it('renders log out button if there is a logged in user', async () => {
    await render(<Navbar />, {
      authenticatedUser: userFactory.build(),
    })

    await screen.findByRole('button', {
      name: 'Log out',
    })
  })
})
