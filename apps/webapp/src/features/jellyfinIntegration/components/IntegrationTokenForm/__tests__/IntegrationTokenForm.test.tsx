import { fireEvent, screen } from '@testing-library/react'
import React from 'react'

import {
  GenerateTokenDocument,
  IntegrationSettingsDocument,
} from '#/generated/gql/graphql'
import { createMockResolver, render } from '#/lib/testUtils'

import { IntegrationTokenForm } from '../IntegrationTokenForm'

const mockIntegrationSettingsQuery = (token = 'test123') => {
  return createMockResolver(IntegrationSettingsDocument, {
    data: {
      integrationSettings: {
        __typename: 'IntegrationSettings',
        integrationToken: token,
      },
    },
  })
}

const mockGenerateTokenMutation = (token = 'test123') => {
  return createMockResolver(GenerateTokenDocument, {
    data: {
      generateToken: {
        __typename: 'IntegrationSettings',
        integrationToken: token,
      },
    },
  })
}

describe('features/jellyfinIntegration/components/IntegrationForm', () => {
  it('allows generating a new token', async () => {
    const mockIntegrationSettings = mockIntegrationSettingsQuery()
    const mockGenerateToken = mockGenerateTokenMutation()
    const [, mockGenerateTokenResolver] = mockGenerateToken

    await render(<IntegrationTokenForm />, {
      requestMocks: [mockIntegrationSettings, mockGenerateToken],
    })

    fireEvent.click(screen.getByRole('button', { name: /generate/i }))

    expect(mockGenerateTokenResolver).toHaveBeenCalledOnce()
  })
})
