import type { InsertUser } from '@serieslist/core-db'
import { user } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { head } from '@serieslist/util-arrays'
import { and, eq } from 'drizzle-orm'

export const findOne = async ({
  ctx,
  userId,
  email,
}: {
  ctx: DBContext
  userId?: number
  email?: string
}) => {
  return await ctx.db
    .select()
    .from(user)
    .where(
      and(
        userId ? eq(user.id, userId) : undefined,
        email ? eq(user.email, email) : undefined,
      ),
    )
    .then(head)
}

export const createOne = async ({
  ctx,
  user: userParams,
}: {
  ctx: DBContext
  user: InsertUser
}) => {
  return ctx.db
    .insert(user)
    .values(userParams)
    .returning()
    .then((r) => r[0])
}
