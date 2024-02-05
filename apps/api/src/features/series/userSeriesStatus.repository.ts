import type { InsertUserSeriesStatus } from '@serieslist/core-db'
import { userSeriesStatus } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { and, eq, inArray } from 'drizzle-orm'

export const findMany = async ({
  ctx,
  seriesIds,
  userId,
}: {
  ctx: DBContext
  seriesIds: number[]
  userId: number
}) => {
  return await ctx.db
    .select()
    .from(userSeriesStatus)
    .where(
      and(
        inArray(userSeriesStatus.seriesId, seriesIds),
        eq(userSeriesStatus.userId, userId),
      ),
    )
}

export const createOrUpdate = async ({
  userId,
  seriesId,
  status,
  ctx,
}: InsertUserSeriesStatus & {
  ctx: DBContext
}) => {
  return await ctx.db
    .insert(userSeriesStatus)
    .values({ userId, seriesId, status })
    .onConflictDoUpdate({
      target: [userSeriesStatus.seriesId, userSeriesStatus.userId],
      set: {
        status,
      },
    })
}

export const deleteOne = async ({
  ctx,
  seriesId,
  userId,
}: {
  ctx: DBContext
  seriesId: number
  userId: number
}) => {
  return await ctx.db
    .delete(userSeriesStatus)
    .where(
      and(
        eq(userSeriesStatus.seriesId, seriesId),
        eq(userSeriesStatus.userId, userId),
      ),
    )
}
