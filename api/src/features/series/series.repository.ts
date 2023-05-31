import { type UpdateObject } from 'kysely'
import { type InsertObject } from 'kysely/dist/cjs/parser/insert-values-parser'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

export const findOne = ({
  ctx,
  seriesId,
  imdbId,
}: {
  ctx: Context
  seriesId?: number
  imdbId?: string
}) => {
  let query = ctx.db.selectFrom('series').selectAll()

  if (seriesId) {
    query = query.where('id', '=', seriesId)
  }

  if (imdbId) {
    query = query.where('imdbId', '=', imdbId)
  }

  return query.executeTakeFirst()
}

export const findMany = ({
  ctx,
  imdbIds,
}: {
  ctx: Context
  imdbIds: string[]
}) => {
  return ctx.db
    .selectFrom('series')
    .selectAll()
    .where('imdbId', 'in', imdbIds)
    .execute()
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

export const updateOneByIMDbId = ({
  ctx,
  imdbId,
  series,
}: {
  ctx: Context
  imdbId: string
  series: UpdateObject<DB, 'series'>
}) => {
  return ctx.db
    .updateTable('series')
    .where('imdbId', '=', imdbId)
    .set(series)
    .returningAll()
    .executeTakeFirst()
}
