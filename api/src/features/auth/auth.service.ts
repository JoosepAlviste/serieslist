import { randomBytes } from 'crypto'

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'

import { config } from '@/config'
import { usersService } from '@/features/users'
import { type LoginInput, type RegisterInput } from '@/generated/gql/graphql'
import { type Context } from '@/types/context'

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './constants'
import * as sessionRepository from './session.repository'
import { type AccessTokenPayload, type RefreshTokenPayload } from './types'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
}

/**
 * Create the access and refresh tokens for the given user.
 */
const createTokens = (sessionToken: string, userId: number) => {
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
const refreshTokens = ({
  ctx,
  sessionToken,
  userId,
}: {
  ctx: Context
  sessionToken: string
  userId: number
}) => {
  const tokens = createTokens(sessionToken, userId)

  void ctx.reply.setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    httpOnly: true,
    path: '/',
    domain: config.webapp.host,
    secure: true,
    sameSite: 'none',
  })

  const now = new Date()
  const refreshExpires = now.setDate(now.getDate() + 30)
  void ctx.reply.setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    path: '/',
    domain: config.webapp.host,
    expires: new Date(refreshExpires),
    secure: true,
    sameSite: 'none',
  })
}

/**
 * Create a new session for the user and set token cookies.
 */
const logUserIn = async ({ ctx, userId }: { ctx: Context; userId: number }) => {
  const sessionToken = randomBytes(43).toString('hex')

  await sessionRepository.createOne({
    ctx,
    session: {
      token: sessionToken,
      userId,
    },
  })

  refreshTokens({ ctx, sessionToken, userId })
}

const createUser = async ({
  ctx,
  input,
}: {
  ctx: Context
  input: RegisterInput
}) => {
  const password = await hashPassword(input.password)

  return await usersService.createOne({
    ctx,
    user: {
      name: input.name,
      email: input.email,
      password,
    },
  })
}

export const register = async ({
  ctx,
  input,
}: {
  ctx: Context
  input: RegisterInput
}) => {
  const existingUser = await usersService.findOne({ ctx, email: input.email })
  if (existingUser) {
    throw new ZodError([
      {
        code: 'custom',
        path: ['input', 'email'],
        message: 'A user with this email already exists.',
      },
    ])
  }

  const user = await createUser({ ctx, input })

  await logUserIn({ ctx, userId: user.id })

  return user
}

export const login = async ({
  ctx,
  input,
}: {
  ctx: Context
  input: LoginInput
}) => {
  const user = await usersService.findOne({ ctx, email: input.email })
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

  await logUserIn({ ctx, userId: user.id })

  return user
}

export const getAuthenticatedUserAndRefreshTokens = async ({
  ctx,
}: {
  ctx: Context
}) => {
  const {
    [ACCESS_TOKEN_COOKIE]: accessToken,
    [REFRESH_TOKEN_COOKIE]: refreshToken,
  } = ctx.req.cookies

  if (accessToken) {
    const decodedAccessToken = jwt.verify(
      accessToken,
      config.secretToken,
    ) as AccessTokenPayload

    return await usersService.findOne({
      ctx,
      userId: decodedAccessToken.userId,
    })
  }

  if (refreshToken) {
    const { sessionToken } = jwt.verify(
      refreshToken,
      config.secretToken,
    ) as RefreshTokenPayload

    const currentSession = await sessionRepository.findOne({
      ctx,
      sessionToken,
    })

    // TODO: Make session.userId non-nullable
    if (currentSession?.isValid && currentSession.userId) {
      const currentUser = await usersService.findOne({
        ctx,
        userId: currentSession.userId,
      })
      if (!currentUser) {
        return undefined
      }

      refreshTokens({
        ctx,
        sessionToken: currentSession.token,
        userId: currentUser.id,
      })

      return currentUser
    }
  }

  return undefined
}

/**
 * Logging the user out is as easy as clearing their auth tokens from the cookies.
 */
export const logOut = ({ ctx }: { ctx: Context }) => {
  void ctx.reply.clearCookie(ACCESS_TOKEN_COOKIE)
  void ctx.reply.clearCookie(REFRESH_TOKEN_COOKIE)

  return true
}
