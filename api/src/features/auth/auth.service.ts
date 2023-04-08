import bcrypt from 'bcryptjs'
import { ZodError } from 'zod'

import { type RegisterInput } from '@/generated/gql/graphql'
import { type Context } from '@/types/context'

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
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

  return user
}
