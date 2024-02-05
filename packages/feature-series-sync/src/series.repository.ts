import type { InsertSeries } from '@serieslist/core-db'
import { series } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { and, lt, asc, eq } from 'drizzle-orm'

import { head } from './utils/array'

export const findMany = async ({
  ctx,
  syncedAtBefore,
}: {
  ctx: DBContext
  syncedAtBefore: Date
}) => {
  const query = ctx.db
    .select()
    .from(series)
    .where(and(lt(series.syncedAt, syncedAtBefore)))
    .orderBy(asc(series.syncedAt))
    .$dynamic()

  return await query
}

export const updateOneByTMDBId = async ({
  ctx,
  tmdbId,
  series: seriesArgs,
}: {
  ctx: DBContext
  tmdbId: number
  series: Partial<InsertSeries>
}) => {
  return await ctx.db
    .update(series)
    .set(seriesArgs)
    .where(eq(series.tmdbId, tmdbId))
    .returning()
    .then(head)
}

export const deleteOne = async ({
  ctx,
  tmdbId,
}: {
  ctx: DBContext
  tmdbId: number
}) => {
  return await ctx.db.delete(series).where(eq(series.tmdbId, tmdbId))
}
