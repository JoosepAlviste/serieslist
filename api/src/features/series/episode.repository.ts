import { type InsertObject } from 'kysely'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

/**
 * Return the episode IMDb IDs and season IDs ordered by the season and
 * episode numbers.
 */
export const findEpisodesAndSeasonsForSeries = ({
  ctx,
  seriesId,
}: {
  ctx: Context
  seriesId: number
}) => {
  return ctx.db
    .selectFrom('season')
    .where('seriesId', '=', seriesId)
    .leftJoin('episode', 'season.id', 'episode.seasonId')
    .select(['episode.imdbId as episodeImdbId', 'episode.seasonId as seasonId'])
    .orderBy('season.number')
    .orderBy('episode.number')
    .execute()
}

export const findOne = ({
  ctx,
  episodeId,
}: {
  ctx: Context
  episodeId: number
}) => {
  return ctx.db
    .selectFrom('episode')
    .where('id', '=', episodeId)
    .selectAll()
    .executeTakeFirst()
}

export const findMany = ({
  ctx,
  seasonIds,
}: {
  ctx: Context
  seasonIds: number[]
}) => {
  return ctx.db
    .selectFrom('episode')
    .selectAll()
    .where('seasonId', 'in', seasonIds)
    .execute()
}

export const createMany = ({
  ctx,
  episodes,
}: {
  ctx: Context
  episodes: InsertObject<DB, 'episode'>[]
}) => {
  return ctx.db.insertInto('episode').values(episodes).execute()
}
