import { randomBytes } from 'crypto'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'

import { config } from '@/config'
import { type LoginInput, type RegisterInput } from '@/generated/gql/graphql'
import { type Context } from '@/types/context'

import { type AccessTokenPayload, type RefreshTokenPayload } from './types'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
}

/**
 * Create the access and refresh tokens for the given user.
 */
export const createTokens = (sessionToken: string, userId: number) => {
  const refreshTokenPayload: RefreshTokenPayload = {
    sessionToken,
  }
  const refreshToken = jwt.sign(refreshTokenPayload, config.secretToken)

  const accessTokenPayload: AccessTokenPayload = {
    sessionToken,
    userId,
  }
  const accessToken = jwt.sign(accessTokenPayload, config.secretToken)

  return { accessToken, refreshToken }
}

/**
 * Create a new session for the user and set token cookies.
 */
const logUserIn = (ctx: Context) => async (userId: number) => {
  const sessionToken = randomBytes(43).toString('hex')

  const session = await ctx.db
    .insertInto('session')
    .values({
      token: sessionToken,
      userId,
    })
    .returning(['userId', 'token'])
    .executeTakeFirst()

  const tokens = createTokens(sessionToken, userId)

  return { ...tokens, session }
}

export const register = (ctx: Context) => async (input: RegisterInput) => {
  const { name, password, email } = input

  const existingUser = await ctx.db
    .selectFrom('user')
    .select('id')
    .where('email', '=', email)
    .executeTakeFirst()
  if (existingUser) {
    throw new ZodError([
      {
        code: 'custom',
        path: ['input', 'email'],
        message: 'A user with this email already exists.',
      },
    ])
  }

  const hashedPassword = await hashPassword(password)

  const user = await ctx.db
    .insertInto('user')
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning(['id', 'name', 'email'])
    .executeTakeFirstOrThrow()

  const tokens = await logUserIn(ctx)(user.id)

  return { ...tokens, user }
}

export const login = (ctx: Context) => async (input: LoginInput) => {
  const user = await ctx.db
    .selectFrom('user')
    .select(['id', 'name', 'email', 'password'])
    .where('email', '=', input.email)
    .executeTakeFirst()
  if (!user) {
    throw new ZodError([
      {
        code: 'custom',
        path: ['input', 'email'],
        message: 'Invalid credentials.',
      },
    ])
  }

  const isValid = await bcrypt.compare(input.password, user.password)
  if (!isValid) {
    throw new ZodError([
      {
        code: 'custom',
        path: ['input', 'email'],
        message: 'Invalid credentials.',
      },
    ])
  }

  const tokens = await logUserIn(ctx)(user.id)

  return { ...tokens, user }
}
