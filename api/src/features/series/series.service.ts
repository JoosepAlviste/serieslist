import { addDays, isFuture, parse } from 'date-fns'

import {
  fetchSeasonDetailsFromOMDb,
  fetchSeriesDetailsFromOMDb,
  type OMDbSearchSeries,
  type OMDbSeries,
  searchSeriesFromOMDb,
  parseOMDbSeriesRuntime,
} from '@/features/omdb'
import { parseOMDbSeriesYears } from '@/features/omdb'
import { type SeriesSearchInput } from '@/generated/gql/graphql'
import { NotFoundError } from '@/lib/errors'
import { type Context } from '@/types/context'

const parseSeriesFromOMDbResponse = (
  omdbSeries: OMDbSearchSeries | OMDbSeries,
) => ({
  imdbId: omdbSeries.imdbID,
  title: omdbSeries.Title,
  poster: omdbSeries.Poster,
  plot: 'Plot' in omdbSeries ? omdbSeries.Plot : null,
  runtimeMinutes:
    'Runtime' in omdbSeries ? parseOMDbSeriesRuntime(omdbSeries.Runtime) : null,
  ...parseOMDbSeriesYears(omdbSeries.Year),
})

export const searchSeries =
  (ctx: Context) => async (input: SeriesSearchInput) => {
    const seriesFromOMDb = await searchSeriesFromOMDb(input.keyword)
    if (!seriesFromOMDb.length) {
      return []
    }

    const existingSeries = await ctx.db
      .selectFrom('series')
      .select(['id', 'imdbId', 'title', 'poster', 'startYear', 'endYear'])
      .where(
        'imdbId',
        'in',
        seriesFromOMDb.map((series) => series.imdbID),
      )
      .execute()
    const existingSeriesImdbIds = existingSeries.map((series) => series.imdbId)

    const newSeriesToAdd = seriesFromOMDb.filter(
      (series) => !existingSeriesImdbIds.includes(series.imdbID),
    )
    if (!newSeriesToAdd.length) {
      return existingSeries
    }

    const newSeries = await ctx.db
      .insertInto('series')
      .values(
        newSeriesToAdd.map((series) => parseSeriesFromOMDbResponse(series)),
      )
      .returning(['id', 'imdbId', 'title', 'poster', 'startYear', 'endYear'])
      .execute()

    return [...existingSeries, ...newSeries]
  }

const getSeriesById = (ctx: Context) => async (id: number) => {
  const series = await ctx.db
    .selectFrom('series')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()
  if (!series) {
    throw new NotFoundError()
  }

  return series
}

const RE_SYNC_AFTER_DAYS = 7

/**
 * Update the details of the series with the given IMDB ID from the OMDb API.
 * This also syncs the seasons and episodes from OMDb, saving them into the
 * database if needed.
 */
const syncSeriesDetailsFromOMDb = (ctx: Context) => async (imdbId: string) => {
  const newSeries = await fetchSeriesDetailsFromOMDb(imdbId)

  const savedSeries = await ctx.db
    .updateTable('series')
    .where('imdbId', '=', imdbId)
    .set({
      ...parseSeriesFromOMDbResponse(newSeries),
      syncedAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  const existingSeasonsAndEpisodes = await ctx.db
    .selectFrom('season')
    .where('seriesId', '=', savedSeries.id)
    .leftJoin('episode', 'season.id', 'episode.id')
    .select(['episode.imdbId as episodeImdbId', 'season.id as seasonId'])
    .orderBy('season.number')
    .orderBy('episode.number')
    .execute()

  const existingSeasonIds = new Set(
    existingSeasonsAndEpisodes.map(({ seasonId }) => seasonId),
  )
  const existingEpisodeImdbIds = new Set(
    existingSeasonsAndEpisodes.map(({ episodeImdbId }) => episodeImdbId),
  )

  const seasonIdsByNumber: Record<number, number> = {}
  existingSeasonIds.forEach((seasonId, index) => {
    if (seasonId) {
      seasonIdsByNumber[index + 1] = seasonId
    }
  })

  const totalNumberOfSeasons = parseInt(newSeries.totalSeasons)
  const existingSeasonsCount = existingSeasonIds.size
  const newSeasonsCount = totalNumberOfSeasons - existingSeasonsCount

  if (newSeasonsCount > 0) {
    const newSeasons = await ctx.db
      .insertInto('season')
      .values(
        // eslint-disable-next-line prefer-spread
        Array.apply(null, Array(newSeasonsCount))
          .map((_, i) => i + 1 + existingSeasonsCount)
          .map((number) => ({
            number,
            seriesId: savedSeries.id,
          })),
      )
      .returningAll()
      .execute()

    newSeasons.forEach((season) => {
      seasonIdsByNumber[season.number] = season.id
    })
  }

  await Promise.all(
    // eslint-disable-next-line prefer-spread
    Array.apply(null, Array(totalNumberOfSeasons))
      .map((_, i) => i + 1)
      .map(async (seasonNumber) => {
        const season = await fetchSeasonDetailsFromOMDb(
          savedSeries.imdbId,
          seasonNumber,
        )
        const notSavedEpisodes = season.Episodes.filter(
          (episode) => !existingEpisodeImdbIds.has(episode.imdbID),
        )

        return await ctx.db
          .insertInto('episode')
          .values(
            notSavedEpisodes.map((episode) => ({
              imdbId: episode.imdbID,
              number: parseInt(episode.Episode),
              title: episode.Title,
              seasonId: seasonIdsByNumber[seasonNumber],
              releasedAt: parse(episode.Released, 'yyyy-MM-dd', new Date()),
              imdbRating: parseFloat(episode.imdbRating) || null,
            })),
          )
          .execute()
      }),
  )

  return savedSeries
}

export const getSeriesByIdAndFetchDetailsFromOmdb =
  (ctx: Context) => async (id: number) => {
    const series = await getSeriesById(ctx)(id)

    if (
      series.syncedAt &&
      isFuture(addDays(series.syncedAt, RE_SYNC_AFTER_DAYS))
    ) {
      return series
    }

    return await syncSeriesDetailsFromOMDb(ctx)(series.imdbId)
  }
