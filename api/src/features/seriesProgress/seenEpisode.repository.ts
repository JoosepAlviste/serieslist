import { type InsertObject } from 'kysely'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

export const findOne = ({
  ctx,
  userId,
  episodeId,
}: {
  ctx: Context
  userId: number
  episodeId: number
}) => {
  return ctx.db
    .selectFrom('seenEpisode')
    .where('userId', '=', userId)
    .where('episodeId', '=', episodeId)
    .executeTakeFirst()
}

export const findMany = ({
  ctx,
  userId,
  episodeIds,
}: {
  ctx: Context
  userId: number
  episodeIds: number[]
}) => {
  return ctx.db
    .selectFrom('seenEpisode')
    .where('userId', '=', userId)
    .where('episodeId', 'in', episodeIds)
    .selectAll()
    .execute()
}

export const createOne = ({
  ctx,
  seenEpisode,
}: {
  ctx: Context
  seenEpisode: InsertObject<DB, 'seenEpisode'>
}) => {
  return ctx.db
    .insertInto('seenEpisode')
    .values(seenEpisode)
    .executeTakeFirstOrThrow()
}

export const deleteOne = ({
  ctx,
  userId,
  episodeId,
}: {
  ctx: Context
  userId: number
  episodeId: number
}) => {
  return ctx.db
    .deleteFrom('seenEpisode')
    .where('userId', '=', userId)
    .where('episodeId', '=', episodeId)
    .execute()
}
