import { episode, season, series, userSeriesStatus } from '@serieslist/core-db'
import type { InsertSeries, UserSeriesStatusStatus } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { and, eq, getTableColumns, inArray } from 'drizzle-orm'

import { head } from '#/utils/array'

export const findOne = async ({
  ctx,
  seriesId,
  imdbId,
  episodeId,
}: {
  ctx: DBContext
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
}: {
  ctx: DBContext
  tmdbIds?: number[]
  seriesIds?: number[]
}) => {
  return await ctx.db
    .select()
    .from(series)
    .where(
      and(
        tmdbIds ? inArray(series.tmdbId, tmdbIds) : undefined,
        seriesIds ? inArray(series.id, seriesIds) : undefined,
      ),
    )
}

export const findManyForUser = async ({
  ctx,
  userId,
  status,
}: {
  ctx: DBContext
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
  ctx: DBContext
  series: InsertSeries[]
}) => {
  return await ctx.db.insert(series).values(seriesArgs).returning()
}
