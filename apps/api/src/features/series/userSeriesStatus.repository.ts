import { type DB } from '@serieslist/db'
import { type Context } from '@serieslist/graphql-server'
import { type InsertObject } from 'kysely'

export const findMany = ({
  ctx,
  seriesIds,
  userId,
}: {
  ctx: Context
  seriesIds: number[]
  userId: number
}) => {
  return ctx.db
    .selectFrom('userSeriesStatus')
    .where('seriesId', 'in', seriesIds)
    .where('userId', '=', userId)
    .selectAll()
    .execute()
}

export const createOrUpdate = ({
  userId,
  seriesId,
  status,
  ctx,
}: InsertObject<DB, 'userSeriesStatus'> & {
  ctx: Context
}) => {
  return ctx.db
    .insertInto('userSeriesStatus')
    .values({
      userId,
      seriesId,
      status,
    })
    .onConflict((oc) =>
      oc.columns(['seriesId', 'userId']).doUpdateSet({ status }),
    )
    .execute()
}

export const deleteOne = ({
  ctx,
  seriesId,
  userId,
}: {
  ctx: Context
  seriesId: number
  userId: number
}) => {
  return ctx.db
    .deleteFrom('userSeriesStatus')
    .where('userId', '=', userId)
    .where('seriesId', '=', seriesId)
    .execute()
}
