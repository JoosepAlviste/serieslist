import { type DB } from '@serieslist/db'
import { type DBContext, type Context } from '@serieslist/graphql-server'
import { type InsertObject } from 'kysely'

export const findOne = ({
  ctx,
  seasonId,
}: {
  ctx: Context
  seasonId: number
}) => {
  return ctx.db
    .selectFrom('season')
    .selectAll()
    .where('id', '=', seasonId)
    .executeTakeFirst()
}

export const findMany = ({
  ctx,
  seriesIds,
  seasonIds,
}: {
  ctx: Context
  seriesIds?: number[]
  seasonIds?: number[]
}) => {
  let query = ctx.db.selectFrom('season').selectAll().orderBy('number')

  if (seriesIds) {
    query = query.where('seriesId', 'in', seriesIds)
  }

  if (seasonIds) {
    query = query.where('id', 'in', seasonIds)
  }

  return query.execute()
}

export const createMany = ({
  ctx,
  seasons,
}: {
  ctx: DBContext
  seasons: InsertObject<DB, 'season'>[]
}) => {
  return ctx.db
    .insertInto('season')
    .values(seasons)
    .returningAll()
    .onConflict((oc) => oc.column('tmdbId').doNothing())
    .execute()
}

export const deleteOne = ({
  ctx,
  seasonId,
}: {
  ctx: DBContext
  seasonId: number
}) => {
  return ctx.db.deleteFrom('season').where('id', '=', seasonId).execute()
}
