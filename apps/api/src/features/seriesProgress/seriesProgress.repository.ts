import type { InsertSeriesProgress } from '@serieslist/db'
import { seriesProgress } from '@serieslist/db'
import type { DBContext } from '@serieslist/graphql-server'
import { and, eq, inArray, isNull } from 'drizzle-orm'

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
    .from(seriesProgress)
    .where(
      and(
        eq(seriesProgress.userId, userId),
        inArray(seriesProgress.seriesId, seriesIds),
      ),
    )
}

export const createOrUpdateOne = async ({
  ctx,
  seriesProgress: seriesProgressArgs,
}: {
  ctx: DBContext
  seriesProgress: InsertSeriesProgress
}) => {
  return await ctx.db
    .insert(seriesProgress)
    .values(seriesProgressArgs)
    .onConflictDoUpdate({
      target: [seriesProgress.seriesId, seriesProgress.userId],
      set: {
        latestSeenEpisodeId: seriesProgressArgs.latestSeenEpisodeId,
        nextEpisodeId: seriesProgressArgs.nextEpisodeId,
        updatedAt: new Date(Date.now()),
      },
    })
}

export const updateMany = async ({
  ctx,
  seriesId,
  nextEpisodeId,
  seriesProgress: seriesProgressArgs,
}: {
  ctx: DBContext
  seriesId: number
  nextEpisodeId: number | null
  seriesProgress: Partial<InsertSeriesProgress>
}) => {
  return await ctx.db
    .update(seriesProgress)
    .set(seriesProgressArgs)
    .where(
      and(
        eq(seriesProgress.seriesId, seriesId),
        nextEpisodeId === null
          ? isNull(seriesProgress.nextEpisodeId)
          : eq(seriesProgress.nextEpisodeId, nextEpisodeId),
      ),
    )
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
    .delete(seriesProgress)
    .where(
      and(
        eq(seriesProgress.seriesId, seriesId),
        eq(seriesProgress.userId, userId),
      ),
    )
}
