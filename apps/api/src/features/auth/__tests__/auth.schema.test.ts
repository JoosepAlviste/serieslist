import { user, type User } from '@serieslist/core-db'
import { userFactory } from '@serieslist/core-db-factories'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import type { LoginInput, RegisterInput } from '#/generated/gql/graphql'
import { graphql } from '#/generated/gql/index'
import { db } from '#/lib/db'
import { checkErrors, executeOperation, expectErrors } from '#/test/testUtils'

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
            email: `test${nanoid()}@test.com`,
            name: 'Test Dude',
            password: 'test123',
            ...input,
          },
        },
        user: null,
      })

    it('allows registering a user', async () => {
      const uid = nanoid()

      const result = await executeMutation({
        email: `test${uid}@test.com`,
        name: 'Test Dude',
      })

      const resUser = checkErrors(result.data?.register)
      expect(resUser.id).toBeTruthy()

      const newUser = await db.query.user.findFirst({
        where: eq(user.id, parseInt(resUser.id)),
      })

      expect(newUser!.name).toBe('Test Dude')
      expect(newUser!.email).toBe(`test${uid}@test.com`)
    })

    it("hashes the users's password", async () => {
      const result = await executeMutation({
        password: 'test123',
      })

      const resUser = checkErrors(result.data?.register)
      expect(resUser.id).toBeTruthy()

      const newUser = await db.query.user.findFirst({
        where: eq(user.id, parseInt(resUser.id)),
      })

      expect(newUser!.password).not.toBe('test123')
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
      const uid = nanoid()

      await userFactory.create({
        email: `test${uid}@test.com`,
      })

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
            email: `test${nanoid()}@test.com`,
            password: 'test123',
            ...input,
          },
        },
        user: null,
      })

    it('allows logging in a user with the correct credentials', async () => {
      const email = `test-${nanoid()}@test.com`

      await userFactory.create({
        email,
        password: await hashPassword('test123'),
      })

      const res = await executeMutation({
        email,
        password: 'test123',
      })
      const resUser = checkErrors(res.data?.login)
      expect(resUser.email).toBe(email)
    })

    it('requires a correct email', async () => {
      await userFactory.create({
        email: `test${nanoid()}@test.com`,
      })

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
      const email = `test${nanoid()}@test.com`

      await userFactory.create({
        password: await hashPassword('test123'),
      })

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

  describe('me query', () => {
    const executeQuery = (user: User | null) =>
      executeOperation({
        operation: graphql(`
          query me {
            me {
              __typename
              ... on User {
                id
                name
                email
              }
              ... on UnauthorizedError {
                message
              }
            }
          }
        `),
        user,
      })

    it('returns the currently authenticated user', async () => {
      const authenticatedUser = await userFactory.create()

      const res = await executeQuery(authenticatedUser)

      const resUser = checkErrors(res.data?.me)

      expect(resUser.id).toEqual(String(authenticatedUser.id))
    })

    it('does not return any user if not authenticated', async () => {
      const res = await executeQuery(null)

      const resUser = expectErrors(res.data?.me)

      expect(resUser.__typename).toBe('UnauthorizedError')
    })
  })
})
