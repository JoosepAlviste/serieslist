import type { InsertEpisode } from '@serieslist/core-db'
import { episode, season } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { eq, inArray, sql } from 'drizzle-orm'

/**
 * Return the episode TMDB IDs and season IDs ordered by the season and
 * episode numbers.
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

export const createOrUpdateMany = async ({
  ctx,
  episodes,
}: {
  ctx: DBContext
  episodes: InsertEpisode[]
}) => {
  return await ctx.db
    .insert(episode)
    .values(episodes)
    .returning()
    .onConflictDoUpdate({
      target: episode.tmdbId,
      set: {
        title: sql`excluded.title`,
        number: sql`excluded.number`,
        imdbRating: sql`excluded.imdb_rating`,
        releasedAt: sql`excluded.released_at`,
      },
    })
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
