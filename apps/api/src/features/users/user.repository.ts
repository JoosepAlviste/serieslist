import { type InsertObject } from 'kysely'

import { type DB } from '#/generated/db'
import { type Context } from '#/types/context'

export const findOne = ({
  ctx,
  userId,
  email,
}: {
  ctx: Context
  userId?: number
  email?: string
}) => {
  let query = ctx.db.selectFrom('user').selectAll()

  if (userId) {
    query = query.where('id', '=', userId)
  }

  if (email) {
    query = query.where('email', '=', email)
  }

  return query.executeTakeFirst()
}

export const createOne = ({
  ctx,
  user,
}: {
  ctx: Context
  user: InsertObject<DB, 'user'>
}) => {
  return ctx.db
    .insertInto('user')
    .values(user)
    .returningAll()
    .executeTakeFirstOrThrow()
}
