import { fireEvent, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { userFactory } from '@/features/users'
import { LoginDocument } from '@/generated/gql/graphql'
import { createMockResolver, fillForm, render } from '@/lib/testUtils'

import { LoginForm } from './LoginForm'

describe('features/auth/components/LoginForm', () => {
  it('allows logging in', async () => {
    const [doc, mockResolver] = createMockResolver(LoginDocument, {
      data: {
        login: userFactory.build({
          email: 'r@r.com',
        }),
      },
    })

    await render(<LoginForm />, {
      requestMocks: [[doc, mockResolver]],
    })

    fillForm({
      Email: 'r@r.com',
      Password: 'test123',
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Log in',
      }),
    )

    await waitFor(() => expect(mockResolver).toHaveBeenCalled())
  })
})
