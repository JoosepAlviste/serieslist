import { fireEvent, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'

import { LoginDocument } from '@/generated/gql/graphql'
import { createMockResolver, fillForm, render } from '@/lib/testUtils'

import { LoginForm } from './LoginForm'

describe('features/auth/components/LoginForm/LoginForm', () => {
  it('allows logging in', async () => {
    const [doc, mockResolver] = createMockResolver(LoginDocument, {
      data: {
        login: {
          __typename: 'User',
          id: '1',
          email: 'r@r.com',
        },
      },
    })

    render(<LoginForm />, {
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
