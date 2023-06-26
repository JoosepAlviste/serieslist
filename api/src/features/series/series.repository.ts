import { type UpdateObject } from 'kysely'
import { type InsertObject } from 'kysely/dist/cjs/parser/insert-values-parser'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

import { type UserSeriesStatus } from './constants'

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
}: {
  ctx: Context
  tmdbIds?: number[]
  seriesIds?: number[]
}) => {
  let query = ctx.db.selectFrom('series').selectAll()

  if (tmdbIds) {
    query = query.where('tmdbId', 'in', tmdbIds)
  }

  if (seriesIds) {
    query = query.where('id', 'in', seriesIds)
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
  status?: UserSeriesStatus
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

export const updateOneByTMDbId = ({
  ctx,
  tmdbId,
  series,
}: {
  ctx: Context
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
