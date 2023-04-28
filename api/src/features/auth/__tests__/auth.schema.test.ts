import { v4 as uuid } from 'uuid'
import { it, describe, expect } from 'vitest'

import { type LoginInput, type RegisterInput } from '@/generated/gql/graphql'
import { graphql } from '@/generated/gql/index'
import { db } from '@/lib/db'
import { checkErrors, executeOperation, expectErrors } from '@/test/testUtils'

import { hashPassword } from '../auth.service'

describe('features/auth/auth.schema', () => {
  describe('register mutation', () => {
    const executeMutation = (input: Partial<RegisterInput>) =>
      executeOperation({
        operation: graphql(`
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
        variables: {
          input: {
            email: `test${uuid()}@test.com`,
            name: 'Test Dude',
            password: 'test123',
            ...input,
          },
        },
        user: null,
      })

    it('allows registering a user', async () => {
      const uid = uuid()

      const result = await executeMutation({
        email: `test${uid}@test.com`,
        name: 'Test Dude',
      })

      const resUser = checkErrors(result.data?.register)
      expect(resUser.id).toBeTruthy()

      const user = await db
        .selectFrom('user')
        .select(['id', 'name', 'email'])
        .where('id', '=', parseInt(resUser.id))
        .executeTakeFirstOrThrow()

      expect(user.name).toBe('Test Dude')
      expect(user.email).toBe(`test${uid}@test.com`)
    })

    it("hashes the users's password", async () => {
      const result = await executeMutation({
        password: 'test123',
      })

      const resUser = checkErrors(result.data?.register)
      expect(resUser.id).toBeTruthy()

      const user = await db
        .selectFrom('user')
        .select(['password'])
        .where('id', '=', parseInt(resUser.id))
        .executeTakeFirstOrThrow()

      expect(user.password).not.toBe('test123')
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

    it('requires a unique email', async () => {
      const uid = uuid()

      await db
        .insertInto('user')
        .values({
          email: `test${uid}@test.com`,
          name: 'Test Dude',
          password: '123',
        })
        .execute()

      const result = await executeMutation({
        email: `test${uid}@test.com`,
      })

      const error = expectErrors(result.data?.register)
      expect(error.fieldErrors).toContainEqual({
        path: ['input', 'email'],
        message: 'A user with this email already exists.',
      })
    })
  })

  describe('login mutation', () => {
    const executeMutation = (input: Partial<LoginInput>) =>
      executeOperation({
        operation: graphql(`
          mutation login($input: LoginInput!) {
            login(input: $input) {
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
        variables: {
          input: {
            email: `test${uuid()}@test.com`,
            password: 'test123',
            ...input,
          },
        },
        user: null,
      })

    it('allows logging in a user with the correct credentials', async () => {
      const email = `test${uuid()}@test.com`

      await db
        .insertInto('user')
        .values({
          email,
          name: 'Test Dude',
          password: await hashPassword('test123'),
        })
        .execute()

      const res = await executeMutation({
        email,
        password: 'test123',
      })
      const resUser = checkErrors(res.data?.login)
      expect(resUser.email).toBe(email)
    })

    it('requires a correct email', async () => {
      await db
        .insertInto('user')
        .values({
          email: `test${uuid()}@test.com`,
          name: 'Test Dude',
          password: await hashPassword('test123'),
        })
        .execute()

      const res = await executeMutation({
        email: 'incorrect@test.com',
        password: 'test123',
      })

      const error = expectErrors(res.data?.login)
      expect(error.fieldErrors).toContainEqual({
        path: ['root'],
        message: 'Invalid credentials.',
      })
    })

    it('requires a correct password', async () => {
      const email = `test${uuid()}@test.com`

      await db
        .insertInto('user')
        .values({
          email,
          name: 'Test Dude',
          password: await hashPassword('test123'),
        })
        .execute()

      const res = await executeMutation({
        email,
        password: 'test1234',
      })

      const error = expectErrors(res.data?.login)
      expect(error.fieldErrors).toContainEqual({
        path: ['root'],
        message: 'Invalid credentials.',
      })
    })
  })
})
