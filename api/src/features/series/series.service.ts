import { addDays, isFuture, parse } from 'date-fns'
import keyBy from 'lodash/keyBy'
import uniq from 'lodash/uniq'

import {
  fetchSeasonDetailsFromOMDb,
  fetchSeriesDetailsFromOMDb,
  type OMDbSearchSeries,
  type OMDbSeries,
  searchSeriesFromOMDb,
  parseOMDbSeriesRuntime,
} from '@/features/omdb'
import { parseOMDbSeriesYears } from '@/features/omdb'
import {
  type SeriesUpdateStatusInput,
  type SeriesSearchInput,
} from '@/generated/gql/graphql'
import { NotFoundError } from '@/lib/errors'
import { type AuthenticatedContext, type Context } from '@/types/context'
import { groupEntitiesByKeyToNestedArray } from '@/utils/groupEntitiesByKeyToNestedArray'

import { UserSeriesStatus } from './constants'

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
      .selectAll()
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
      .returningAll()
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

export const syncSeasonsAndEpisodesFromOMDb =
  (ctx: Context) =>
  async ({
    seriesId,
    imdbId,
    totalNumberOfSeasons,
  }: {
    seriesId: number
    imdbId: string
    totalNumberOfSeasons: number
  }) => {
    const existingSeasonsAndEpisodes = await ctx.db
      .selectFrom('season')
      .where('seriesId', '=', seriesId)
      .leftJoin('episode', 'season.id', 'episode.seasonId')
      .select(['episode.imdbId as episodeImdbId', 'season.id as seasonId'])
      .orderBy('season.number')
      .orderBy('episode.number')
      .execute()

    const existingSeasonIds = uniq(
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

    const existingSeasonsCount = existingSeasonIds.length
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
              seriesId,
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
          const season = await fetchSeasonDetailsFromOMDb(imdbId, seasonNumber)
          const notSavedEpisodes = season.Episodes.filter(
            (episode) => !existingEpisodeImdbIds.has(episode.imdbID),
          )
          if (!notSavedEpisodes.length) {
            return
          }

          // TODO: Update existing episodes
          return await ctx.db
            .insertInto('episode')
            .values(
              notSavedEpisodes.map((episode) => ({
                imdbId: episode.imdbID,
                number: parseInt(episode.Episode),
                title: episode.Title,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                seasonId: seasonIdsByNumber[seasonNumber]!,
                releasedAt:
                  episode.Released !== 'N/A'
                    ? parse(episode.Released, 'yyyy-MM-dd', new Date())
                    : null,
                imdbRating: parseFloat(episode.imdbRating) || null,
              })),
            )
            .execute()
        }),
    )
  }

/**
 * Update the details of the series with the given IMDB ID from the OMDb API.
 * This also syncs the seasons and episodes from OMDb, saving them into the
 * database if needed.
 */
export const syncSeriesDetailsFromOMDb =
  (ctx: Context) => async (imdbId: string) => {
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

    const totalNumberOfSeasons = parseInt(newSeries.totalSeasons)

    if (totalNumberOfSeasons) {
      await syncSeasonsAndEpisodesFromOMDb(ctx)({
        imdbId: savedSeries.imdbId,
        seriesId: savedSeries.id,
        totalNumberOfSeasons,
      })
    }

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

export const findSeasonsBySeriesIds =
  (ctx: Context) => async (seriesIds: number[]) => {
    const allSeasons = await ctx.db
      .selectFrom('season')
      .selectAll()
      .where('seriesId', 'in', seriesIds)
      .execute()

    return groupEntitiesByKeyToNestedArray({
      entities: allSeasons,
      ids: seriesIds,
      fieldToGroupBy: 'seriesId',
    })
  }

export const findEpisodesBySeasonIds =
  (ctx: Context) => async (seasonIds: number[]) => {
    const allEpisodes = await ctx.db
      .selectFrom('episode')
      .selectAll()
      .where('seasonId', 'in', seasonIds)
      .execute()

    return groupEntitiesByKeyToNestedArray({
      entities: allEpisodes,
      ids: seasonIds,
      fieldToGroupBy: 'seasonId',
    })
  }

export const updateSeriesStatusForUser =
  (ctx: AuthenticatedContext) => async (input: SeriesUpdateStatusInput) => {
    const series = await ctx.db
      .selectFrom('series')
      .where('id', '=', input.seriesId)
      .selectAll()
      .executeTakeFirst()
    if (!series) {
      throw new NotFoundError()
    }

    const status = input.status ? UserSeriesStatus[input.status] : null

    await ctx.db
      .insertInto('userSeriesStatus')
      .values({
        userId: ctx.currentUser.id,
        seriesId: input.seriesId,
        status,
      })
      .onConflict((oc) =>
        oc.columns(['seriesId', 'userId']).doUpdateSet({ status }),
      )
      .execute()

    return series
  }

export const findStatusForSeries =
  (ctx: Context) =>
  async (seriesIds: number[]): Promise<(UserSeriesStatus | null)[]> => {
    if (!ctx.currentUser) {
      return seriesIds.map(() => null)
    }

    const allStatuses = await ctx.db
      .selectFrom('userSeriesStatus')
      .where('seriesId', 'in', seriesIds)
      .where('userId', '=', ctx.currentUser.id)
      .selectAll()
      .execute()

    const statusesBySeriesId = keyBy(allStatuses, 'seriesId')

    return seriesIds.map((seriesId) => {
      const status = statusesBySeriesId[seriesId]?.status
      return status ? UserSeriesStatus[status] : null
    })
  }
