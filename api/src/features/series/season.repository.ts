import { type InsertObject } from 'kysely'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

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
  let query = ctx.db.selectFrom('season').selectAll()

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
  ctx: Context
  seasons: InsertObject<DB, 'season'>[]
}) => {
  return ctx.db.insertInto('season').values(seasons).returningAll().execute()
}
