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
 * Generate new access and refresh tokens for the user and save them into the cookies.
 */
const refreshTokens =
  (ctx: Context) => (sessionToken: string, userId: number) => {
    const tokens = createTokens(sessionToken, userId)

    void ctx.reply.setCookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      path: '/',
      domain: 'localhost',
      secure: true,
      sameSite: 'none',
    })

    const now = new Date()
    const refreshExpires = now.setDate(now.getDate() + 30)
    void ctx.reply.setCookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      path: '/',
      domain: 'localhost',
      expires: new Date(refreshExpires),
      secure: true,
      sameSite: 'none',
    })
  }

/**
 * Create a new session for the user and set token cookies.
 */
const logUserIn = (ctx: Context) => async (userId: number) => {
  const sessionToken = randomBytes(43).toString('hex')

  await ctx.db
    .insertInto('session')
    .values({
      token: sessionToken,
      userId,
    })
    .returning(['userId', 'token'])
    .executeTakeFirst()

  refreshTokens(ctx)(sessionToken, userId)
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

  await logUserIn(ctx)(user.id)

  return user
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
        path: ['root'],
        message: 'Invalid credentials.',
      },
    ])
  }

  const isValid = await bcrypt.compare(input.password, user.password)
  if (!isValid) {
    throw new ZodError([
      {
        code: 'custom',
        path: ['root'],
        message: 'Invalid credentials.',
      },
    ])
  }

  await logUserIn(ctx)(user.id)

  return user
}
