import { seriesProgress, type InsertSeriesProgress } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { and, eq, isNull } from 'drizzle-orm'

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
