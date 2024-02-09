import type { InsertSession } from '@serieslist/core-db'
import { session } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { head } from '@serieslist/util-arrays'
import { eq } from 'drizzle-orm'

export const findOne = async ({
  ctx,
  sessionToken,
}: {
  ctx: DBContext
  sessionToken: string
}) => {
  return await ctx.db
    .select()
    .from(session)
    .where(eq(session.token, sessionToken))
    .then(head)
}

export const createOne = async ({
  ctx,
  session: sessionParams,
}: {
  ctx: DBContext
  session: InsertSession
}) => {
  return ctx.db.insert(session).values(sessionParams).returning()
}
