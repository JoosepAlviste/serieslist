import type { User } from '@serieslist/core-db'
import { user as userTable } from '@serieslist/core-db'
import { userFactory } from '@serieslist/core-db-factories'
import { eq } from 'drizzle-orm'

import { graphql } from '#/generated/gql'
import { db } from '#/lib/db'
import { checkErrors, executeOperation, expectErrors } from '#/test/testUtils'

describe('features/jellyfinIntegration/jellyfinIntegration.schema', () => {
  describe('integrationSettings query', () => {
    const executeIntegrationSettingsQuery = ({
      user,
    }: {
      user: User | null
    }) => {
      return executeOperation({
        operation: graphql(`
          query integrationSettings {
            integrationSettings {
              __typename
              ... on IntegrationSettings {
                integrationToken
              }
              ... on UnauthorizedError {
                __typename
                message
              }
            }
          }
        `),
        user,
      })
    }

    it("returns the current user's integration settings", async () => {
      const user = await userFactory.create({
        integrationsToken: 'test123',
      })
      const result = await executeIntegrationSettingsQuery({ user })
      const integrationSettings = checkErrors(result.data?.integrationSettings)

      expect(integrationSettings.integrationToken).toBe('test123')
    })

    it('requires a logged in user', async () => {
      const result = await executeIntegrationSettingsQuery({ user: null })
      const integrationSettings = expectErrors(result.data?.integrationSettings)

      expect(integrationSettings.__typename).toBe('UnauthorizedError')
    })
  })

  describe('generateToken mutation', () => {
    const executeGenerateToken = ({ user }: { user: User | null }) =>
      executeOperation({
        operation: graphql(`
          mutation generateToken {
            generateToken {
              __typename
              ... on IntegrationSettings {
                integrationToken
              }
              ... on UnauthorizedError {
                __typename
                message
              }
            }
          }
        `),
        user,
      })

    it('generates a new integrations token for the current user', async () => {
      const user = await userFactory.create()

      const result = await executeGenerateToken({ user })
      const mutationResponse = checkErrors(result.data?.generateToken)

      expect(mutationResponse.integrationToken).toEqual(expect.any(String))

      const updatedUser = await db.query.user.findFirst({
        where: eq(userTable.id, user.id),
      })

      expect(updatedUser?.integrationsToken).toEqual(
        mutationResponse.integrationToken,
      )
    })

    it('requires a logged in user', async () => {
      const result = await executeGenerateToken({ user: null })
      const mutationResponse = expectErrors(result.data?.generateToken)

      expect(mutationResponse.__typename).toBe('UnauthorizedError')
    })
  })
})
