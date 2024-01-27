import { type DB, type UserSeriesStatusStatus } from '@serieslist/db'
import { type DBContext, type Context } from '@serieslist/graphql-server'
import { type UpdateObject, type InsertObject } from 'kysely'

export const findOne = ({
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
  let query = ctx.db.selectFrom('series').selectAll('series')

  if (seriesId) {
    query = query.where('id', '=', seriesId)
  }

  if (imdbId) {
    query = query.where('imdbId', '=', imdbId)
  }

  if (episodeId) {
    query = query
      .innerJoin('season', 'series.id', 'season.seriesId')
      .innerJoin('episode', 'season.id', 'episode.seasonId')
      .where('episode.id', '=', episodeId)
  }

  return query.executeTakeFirst()
}

export const findMany = ({
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
  let query = ctx.db.selectFrom('series').selectAll()

  if (tmdbIds) {
    query = query.where('tmdbId', 'in', tmdbIds)
  }

  if (seriesIds) {
    query = query.where('id', 'in', seriesIds)
  }

  if (syncedAtBefore) {
    query = query.where('syncedAt', '<', syncedAtBefore)
  }

  if (orderBySyncedAt) {
    query = query.orderBy('syncedAt', orderBySyncedAt)
  }

  return query.execute()
}

export const findManyForUser = ({
  ctx,
  userId,
  status,
}: {
  ctx: Context
  userId: number
  status?: UserSeriesStatusStatus
}) => {
  let query = ctx.db
    .selectFrom('series')
    .innerJoin('userSeriesStatus', 'series.id', 'userSeriesStatus.seriesId')
    .where('userSeriesStatus.userId', '=', userId)
    .selectAll('series')
    .orderBy('series.title')

  if (status) {
    query = query.where('userSeriesStatus.status', '=', status)
  }

  return query.execute()
}

export const createMany = ({
  ctx,
  series,
}: {
  ctx: Context
  series: InsertObject<DB, 'series'>[]
}) => {
  return ctx.db.insertInto('series').values(series).returningAll().execute()
}

export const updateOneByTMDBId = ({
  ctx,
  tmdbId,
  series,
}: {
  ctx: DBContext
  tmdbId: number
  series: UpdateObject<DB, 'series'>
}) => {
  return ctx.db
    .updateTable('series')
    .where('tmdbId', '=', tmdbId)
    .set(series)
    .returningAll()
    .executeTakeFirst()
}

export const deleteOne = ({
  ctx,
  tmdbId,
}: {
  ctx: DBContext
  tmdbId: number
}) => {
  return ctx.db.deleteFrom('series').where('tmdbId', '=', tmdbId).execute()
}
