import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { userFactory } from '#/features/users'
import { render } from '#/lib/testUtils'

import { Header } from './Header'

describe('components/Header', () => {
  it('renders log in and redister links if there is no logged in user', async () => {
    await render(<Header />, {
      authenticatedUser: null,
    })

    screen.getByText('Log in')
  })

  it('renders log out button if there is a logged in user', async () => {
    await render(<Header />, {
      authenticatedUser: userFactory.build({
        name: 'Test Dude',
      }),
    })

    await userEvent.click(
      await screen.findByRole('button', {
        name: 'Current User Test Dude Expand',
      }),
    )

    await screen.findByRole('menuitem', {
      name: 'Log out',
    })
  })
})
