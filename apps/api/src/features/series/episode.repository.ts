import { episode, season, seenEpisode } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { and, asc, desc, eq, gt, inArray, isNull, lte, or } from 'drizzle-orm'

import { head } from '#/utils/array'

/**
 * Return the episode TMDB IDs and season IDs ordered by the season and
 * episode numbers.
 *
 * TODO: This is probably duplicated in the series syncing package?
 */
export const findEpisodesAndSeasonsForSeries = async ({
  ctx,
  seriesId,
}: {
  ctx: DBContext
  seriesId: number
}) => {
  return await ctx.db
    .select({
      episodeId: episode.id,
      episodeTmdbId: episode.tmdbId,
      seasonId: season.id,
      seasonTmdbId: season.tmdbId,
      seasonNumber: season.number,
    })
    .from(season)
    .leftJoin(episode, eq(season.id, episode.seasonId))
    .where(eq(season.seriesId, seriesId))
    .orderBy(season.number, episode.number)
}

export const findOne = async ({
  ctx,
  episodeId,
}: {
  ctx: DBContext
  episodeId: number
}) => {
  return await ctx.db.select().from(episode).where(eq(episode.id, episodeId))
}

export const findManyByNumberForManySeries = async ({
  ctx,
  seriesIds,
  seasonNumber,
  episodeNumber,
}: {
  ctx: DBContext
  seriesIds: number[]
  seasonNumber: number
  episodeNumber: number
}) => {
  return await ctx.db
    .select()
    .from(episode)
    .innerJoin(season, eq(episode.seasonId, season.id))
    .where(
      and(
        inArray(season.seriesId, seriesIds),
        eq(season.number, seasonNumber),
        eq(episode.number, episodeNumber),
      ),
    )
}

export const findOneWithSeasonAndSeriesInfo = async ({
  ctx,
  episodeId,
}: {
  ctx: DBContext
  episodeId: number
}) => {
  const item = await ctx.db
    .select()
    .from(episode)
    .innerJoin(season, eq(season.id, episode.seasonId))
    .where(eq(episode.id, episodeId))
    .then(head)

  return (
    item && {
      ...item.episode,
      seasonNumber: item.season.number,
      seriesId: item.season.seriesId,
    }
  )
}

export const findLastEpisodeOfSeason = async ({
  ctx,
  seriesId,
  seasonNumber,
}: {
  ctx: DBContext
  seriesId: number
  seasonNumber: number
}) => {
  const res = await ctx.db
    .select()
    .from(episode)
    .innerJoin(season, eq(episode.seasonId, season.id))
    .where(and(eq(season.number, seasonNumber), eq(season.seriesId, seriesId)))
    .orderBy(desc(episode.number))
    .limit(1)

  return res[0]?.episode
}

export const findLastEpisodeOfSeries = async ({
  ctx,
  seriesId,
}: {
  ctx: DBContext
  seriesId: number
}) => {
  const res = await ctx.db
    .select()
    .from(episode)
    .innerJoin(season, eq(episode.seasonId, season.id))
    .where(eq(season.seriesId, seriesId))
    .orderBy(desc(season.number), desc(episode.number))
    .limit(1)
    .then(head)

  return res?.episode
}

export const findFirstNotSeenEpisodeInSeriesForUser = async ({
  ctx,
  seriesId,
  userId,
}: {
  ctx: DBContext
  seriesId: number
  userId: number
}) => {
  return await ctx.db
    .select()
    .from(episode)
    .innerJoin(season, eq(season.id, episode.seasonId))
    .leftJoin(
      seenEpisode,
      and(
        eq(seenEpisode.episodeId, episode.id),
        eq(seenEpisode.userId, userId),
      ),
    )
    .where(
      and(
        isNull(seenEpisode.userId),
        eq(season.seriesId, seriesId),
        gt(season.number, 0),
      ),
    )
    .orderBy(asc(season.number), asc(episode.number))
    .then(head)
}

export const findNextEpisode = async ({
  ctx,
  seriesId,
  seasonNumber,
  episodeNumber,
}: {
  ctx: DBContext
  seriesId: number
  seasonNumber: number
  episodeNumber: number
}) => {
  const res = await ctx.db
    .select()
    .from(episode)
    .innerJoin(season, eq(season.id, episode.seasonId))
    .where(
      and(
        eq(season.seriesId, seriesId),
        or(
          and(
            eq(season.number, seasonNumber),
            eq(episode.number, episodeNumber + 1),
          ),
          and(eq(season.number, seasonNumber + 1), eq(episode.number, 1)),
        ),
      ),
    )
    .then(head)

  return res?.episode
}

export const findMany = async ({
  ctx,
  seasonIds,
  episodeIds,
  releasedBefore,
}: {
  ctx: DBContext
  seasonIds?: number[]
  episodeIds?: number[]
  releasedBefore?: Date
}) => {
  return await ctx.db
    .select()
    .from(episode)
    .orderBy(episode.number)
    .where(
      and(
        seasonIds ? inArray(episode.seasonId, seasonIds) : undefined,
        episodeIds ? inArray(episode.id, episodeIds) : undefined,
        releasedBefore ? lte(episode.releasedAt, releasedBefore) : undefined,
      ),
    )
}

export const deleteMany = async ({
  ctx,
  episodeIds,
}: {
  ctx: DBContext
  episodeIds: number[]
}) => {
  return await ctx.db.delete(episode).where(inArray(episode.id, episodeIds))
}
