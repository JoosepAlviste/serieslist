import { type InsertObject } from 'kysely'

import { type DB } from '@/generated/db'
import { type Context } from '@/types/context'

/**
 * Return the episode TMDB IDs and season IDs ordered by the season and
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
    .select([
      'episode.tmdbId as episodeTmdbId',
      'season.id as seasonId',
      'season.tmdbId as seasonTmdbId',
      'season.number as seasonNumber',
    ])
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

export const findOneByNumber = ({
  ctx,
  seriesId,
  seasonNumber,
  episodeNumber,
}: {
  ctx: Context
  seriesId: number
  seasonNumber: number
  episodeNumber: number
}) => {
  return ctx.db
    .selectFrom('episode')
    .innerJoin('season', 'season.id', 'episode.seasonId')
    .where('seriesId', '=', seriesId)
    .where('season.number', '=', seasonNumber)
    .where('episode.number', '=', episodeNumber)
    .selectAll('episode')
    .executeTakeFirst()
}

export const findOneWithSeasonAndSeriesInfo = ({
  ctx,
  episodeId,
}: {
  ctx: Context
  episodeId: number
}) => {
  return ctx.db
    .selectFrom('episode')
    .innerJoin('season', 'season.id', 'episode.seasonId')
    .where('episode.id', '=', episodeId)
    .selectAll('episode')
    .select(['season.number as seasonNumber', 'season.seriesId as seriesId'])
    .executeTakeFirst()
}

export const findLastEpisodeOfSeason = ({
  ctx,
  seriesId,
  seasonNumber,
}: {
  ctx: Context
  seriesId: number
  seasonNumber: number
}) => {
  return ctx.db
    .selectFrom('episode')
    .innerJoin('season', 'episode.seasonId', 'season.id')
    .where('season.number', '=', seasonNumber)
    .where('season.seriesId', '=', seriesId)
    .orderBy('episode.number', 'desc')
    .limit(1)
    .selectAll('episode')
    .executeTakeFirst()
}

export const findLastEpisodeOfSeries = ({
  ctx,
  seriesId,
}: {
  ctx: Context
  seriesId: number
}) => {
  return ctx.db
    .selectFrom('episode')
    .innerJoin('season', 'episode.seasonId', 'season.id')
    .where('season.seriesId', '=', seriesId)
    .orderBy('season.number', 'desc')
    .orderBy('episode.number', 'desc')
    .limit(1)
    .selectAll('episode')
    .executeTakeFirst()
}

export const findFirstNotSeenEpisodeInSeriesForUser = async ({
  ctx,
  seriesId,
  userId,
}: {
  ctx: Context
  seriesId: number
  userId: number
}) => {
  return ctx.db
    .selectFrom('episode')
    .innerJoin('season', 'season.id', 'episode.seasonId')
    .where(({ not, exists, selectFrom }) =>
      not(
        exists(
          selectFrom('seenEpisode')
            .where('seenEpisode.userId', '=', userId)
            .whereRef('seenEpisode.episodeId', '=', 'episode.id'),
        ),
      ),
    )
    .where('season.seriesId', '=', seriesId)
    .selectAll('episode')
    .select(['season.number as seasonNumber'])
    .orderBy('seasonNumber', 'asc')
    .orderBy('episode.number', 'asc')
    .limit(1)
    .executeTakeFirst()
}

export const findNextEpisode = async ({
  ctx,
  seriesId,
  seasonNumber,
  episodeNumber,
}: {
  ctx: Context
  seriesId: number
  seasonNumber: number
  episodeNumber: number
}) => {
  return ctx.db
    .selectFrom('episode')
    .innerJoin('season', 'season.id', 'episode.seasonId')
    .where('seriesId', '=', seriesId)
    .where(({ and, or, cmpr }) =>
      or([
        and([
          cmpr('season.number', '=', seasonNumber),
          cmpr('episode.number', '=', episodeNumber + 1),
        ]),
        and([
          cmpr('season.number', '=', seasonNumber + 1),
          cmpr('episode.number', '=', 1),
        ]),
      ]),
    )
    .selectAll('episode')
    .executeTakeFirst()
}

export const findMany = ({
  ctx,
  seasonIds,
  episodeIds,
}: {
  ctx: Context
  seasonIds?: number[]
  episodeIds?: number[]
}) => {
  let query = ctx.db.selectFrom('episode').selectAll().orderBy('number')

  if (seasonIds) {
    query = query.where('seasonId', 'in', seasonIds)
  }

  if (episodeIds) {
    query = query.where('id', 'in', episodeIds)
  }

  return query.execute()
}

export const createOrUpdateMany = ({
  ctx,
  episodes,
}: {
  ctx: Context
  episodes: InsertObject<DB, 'episode'>[]
}) => {
  return ctx.db
    .insertInto('episode')
    .values(episodes)
    .returningAll()
    .onConflict((oc) =>
      oc.column('tmdbId').doUpdateSet({
        title: (eb) => eb.ref('excluded.title'),
        number: (eb) => eb.ref('excluded.number'),
        imdbRating: (eb) => eb.ref('excluded.imdbRating'),
        releasedAt: (eb) => eb.ref('excluded.releasedAt'),
      }),
    )
    .execute()
}
