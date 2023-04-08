import { it, describe, expect } from 'vitest'

import { type RegisterInput } from '@/generated/gql/graphql'
import { graphql } from '@/generated/gql/index'
import { db } from '@/lib/db'
import { checkErrors, executeOperation, expectErrors } from '@/test/testUtils'

describe('features/auth/auth.schema', () => {
  describe('register mutation', () => {
    const executeMutation = (input: Partial<RegisterInput>) =>
      executeOperation(
        graphql(`
          mutation register($input: RegisterInput!) {
            register(input: $input) {
              __typename
              ... on User {
                id
                name
                email
              }
              ... on InvalidInputError {
                fieldErrors {
                  path
                  message
                }
              }
            }
          }
        `),
        {
          input: {
            email: 'test@test.com',
            name: 'Test Dude',
            password: 'test123',
            ...input,
          },
        },
      )

    it('allows registering a user', async () => {
      const result = await executeMutation({
        email: 'test@test.com',
        name: 'Test Dude',
      })

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

    it('requires a valid email', async () => {
      const result = await executeMutation({
        email: 'an invalid email',
      })

      const error = expectErrors(result.data?.register)
      expect(error.fieldErrors).toContainEqual({
        path: ['input', 'email'],
        message: 'Invalid email',
      })
    })
  })
})
