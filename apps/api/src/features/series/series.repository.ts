import { episode, season, series, userSeriesStatus } from '@serieslist/db'
import type { InsertSeries, UserSeriesStatusStatus } from '@serieslist/db'
import type { DBContext, Context } from '@serieslist/graphql-server'
import { and, asc, desc, eq, getTableColumns, inArray, lt } from 'drizzle-orm'

import { head } from '#/utils/array'

export const findOne = async ({
  ctx,
  seriesId,
  imdbId,
  episodeId,
}: {
  ctx: Context
  seriesId?: number
  imdbId?: string
  episodeId?: number
}) => {
  let query = ctx.db
    .select(getTableColumns(series))
    .from(series)
    .where(
      and(
        seriesId ? eq(series.id, seriesId) : undefined,
        imdbId ? eq(series.imdbId, imdbId) : undefined,
      ),
    )
    .$dynamic()
  if (episodeId) {
    // TODO: Does this work?
    query = query
      .innerJoin(season, eq(series.id, season.seriesId))
      .innerJoin(episode, eq(season.id, episode.seasonId))
      .where(eq(episode.id, episodeId))
  }

  return await query.then(head)
}

export const findMany = async ({
  ctx,
  tmdbIds,
  seriesIds,
  syncedAtBefore,
  orderBySyncedAt,
}: {
  ctx: DBContext
  tmdbIds?: number[]
  seriesIds?: number[]
  syncedAtBefore?: Date
  orderBySyncedAt?: 'asc' | 'desc'
}) => {
  let query = ctx.db
    .select()
    .from(series)
    .where(
      and(
        tmdbIds ? inArray(series.tmdbId, tmdbIds) : undefined,
        seriesIds ? inArray(series.id, seriesIds) : undefined,
        syncedAtBefore ? lt(series.syncedAt, syncedAtBefore) : undefined,
      ),
    )
    .$dynamic()

  if (orderBySyncedAt === 'asc') {
    query = query.orderBy(asc(series.syncedAt))
  } else if (orderBySyncedAt === 'desc') {
    query = query.orderBy(desc(series.syncedAt))
  }

  return await query
}

export const findManyForUser = async ({
  ctx,
  userId,
  status,
}: {
  ctx: Context
  userId: number
  status?: UserSeriesStatusStatus
}) => {
  return await ctx.db
    .select(getTableColumns(series))
    .from(series)
    .innerJoin(userSeriesStatus, eq(series.id, userSeriesStatus.seriesId))
    .where(
      and(
        eq(userSeriesStatus.userId, userId),
        status ? eq(userSeriesStatus.status, status) : undefined,
      ),
    )
    .orderBy(series.title)
}

export const createMany = async ({
  ctx,
  series: seriesArgs,
}: {
  ctx: Context
  series: InsertSeries[]
}) => {
  return await ctx.db.insert(series).values(seriesArgs).returning()
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
