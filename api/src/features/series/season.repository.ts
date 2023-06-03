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
}: {
  ctx: Context
  seriesIds: number[]
}) => {
  return ctx.db
    .selectFrom('season')
    .selectAll()
    .where('seriesId', 'in', seriesIds)
    .execute()
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
