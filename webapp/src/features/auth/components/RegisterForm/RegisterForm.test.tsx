import { fireEvent, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { userFactory } from '@/features/users/user.factory'
import { RegisterDocument } from '@/generated/gql/graphql'
import { createMockResolver, fillForm, render } from '@/lib/testUtils'

import { RegisterForm } from './RegisterForm'

describe('features/auth/components/RegisterForm', () => {
  it('allows registering', async () => {
    const [doc, mockResolver] = createMockResolver(RegisterDocument, {
      data: {
        register: userFactory.build({
          email: 'r@r.com',
        }),
      },
    })

    render(<RegisterForm />, {
      requestMocks: [[doc, mockResolver]],
    })

    fillForm({
      Name: 'Test Dude',
      Email: 'r@r.com',
      Password: 'test123',
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Register',
      }),
    )

    await waitFor(() => expect(mockResolver).toHaveBeenCalled())
  })
})
