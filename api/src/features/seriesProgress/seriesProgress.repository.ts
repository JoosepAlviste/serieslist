import { type InsertObject } from 'kysely'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

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
    .selectFrom('seriesProgress')
    .where('userId', '=', userId)
    .where('seriesId', 'in', seriesIds)
    .selectAll()
    .execute()
}

export const createOrUpdateOne = ({
  ctx,
  seriesProgress,
}: {
  ctx: Context
  seriesProgress: InsertObject<DB, 'seriesProgress'>
}) => {
  return ctx.db
    .insertInto('seriesProgress')
    .values(seriesProgress)
    .onConflict((oc) =>
      oc.columns(['seriesId', 'userId']).doUpdateSet({
        latestSeenEpisodeId: seriesProgress.latestSeenEpisodeId,
        nextEpisodeId: seriesProgress.nextEpisodeId,
        updatedAt: new Date(Date.now()),
      }),
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
    .deleteFrom('seriesProgress')
    .where('seriesId', '=', seriesId)
    .where('userId', '=', userId)
    .execute()
}
