import { type InsertObject } from 'kysely'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

export const findOne = ({
  ctx,
  sessionToken,
}: {
  ctx: Context
  sessionToken: string
}) => {
  return ctx.db
    .selectFrom('session')
    .selectAll()
    .where('token', '=', sessionToken)
    .executeTakeFirst()
}

export const createOne = async ({
  ctx,
  session,
}: {
  ctx: Context
  session: InsertObject<DB, 'session'>
}) => {
  return await ctx.db
    .insertInto('session')
    .values(session)
    .returningAll()
    .executeTakeFirst()
}