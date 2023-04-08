import { it, describe, expect } from 'vitest'

import { graphql } from '@/generated/gql/index'
import { db } from '@/lib/db'
import { checkErrors, executeOperation } from '@/test/testUtils'

describe('features/auth/auth.schema', () => {
  describe('register mutation', () => {
    it('allows registering a user', async () => {
      const result = await executeOperation(
        graphql(`
          mutation register($input: RegisterInput!) {
            register(input: $input) {
              __typename
              ... on User {
                id
                name
                email
              }
            }
          }
        `),
        {
          input: {
            email: 'test@test.com',
            name: 'Test Dude',
            password: 'abc123',
          },
        },
      )

      const resultUser = checkErrors(result.data?.register)
      expect(resultUser.id).toBeTruthy()

      const user = await db
        .selectFrom('user')
        .select(['id', 'name', 'email'])
        .where('id', '=', parseInt(resultUser.id))
        .executeTakeFirstOrThrow()

      expect(user.name).toBe('Test Dude')
      expect(user.email).toBe('test@test.com')
    })
  })
})
