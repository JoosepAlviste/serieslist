import { addDays, isFuture, parse } from 'date-fns'
import keyBy from 'lodash/keyBy'
import uniq from 'lodash/uniq'

import {
  type OMDbSearchSeries,
  type OMDbSeries,
  omdbService,
} from '@/features/omdb'
import {
  type SeriesUpdateStatusInput,
  type SeriesSearchInput,
} from '@/generated/gql/graphql'
import { createArrayOfLength } from '@/lib/createArrayOfLength'
import { NotFoundError } from '@/lib/errors'
import { type AuthenticatedContext, type Context } from '@/types/context'

import { UserSeriesStatus } from './constants'
import * as episodeRepository from './episode.repository'
import * as seasonRepository from './season.repository'
import * as seriesRepository from './series.repository'
import * as userSeriesStatusRepository from './userSeriesStatus.repository'

const parseSeriesFromOMDbResponse = (
  omdbSeries: OMDbSearchSeries | OMDbSeries,
) => ({
  imdbId: omdbSeries.imdbID,
  title: omdbSeries.Title,
  poster: omdbSeries.Poster,
  plot: 'Plot' in omdbSeries ? omdbSeries.Plot : null,
  runtimeMinutes:
    'Runtime' in omdbSeries
      ? omdbService.parseOMDbSeriesRuntime({ runtime: omdbSeries.Runtime })
      : null,
  ...omdbService.parseOMDbSeriesYears({ years: omdbSeries.Year }),
})

export const searchSeries = async ({
  ctx,
  input,
}: {
  ctx: Context
  input: SeriesSearchInput
}) => {
  const seriesFromOMDb = await omdbService.searchSeriesFromOMDb({
    keyword: input.keyword,
  })
  if (!seriesFromOMDb.length) {
    return []
  }

  const existingSeries = await seriesRepository.findMany({
    ctx,
    imdbIds: seriesFromOMDb.map((series) => series.imdbID),
  })
  const existingSeriesImdbIds = existingSeries.map((series) => series.imdbId)

  const newSeriesToAdd = seriesFromOMDb.filter(
    (series) => !existingSeriesImdbIds.includes(series.imdbID),
  )
  if (!newSeriesToAdd.length) {
    return existingSeries
  }

  const newSeries = await seriesRepository.createMany({
    ctx,
    series: newSeriesToAdd.map(parseSeriesFromOMDbResponse),
  })

  return [...existingSeries, ...newSeries]
}

const getSeriesById = (ctx: Context) => async (id: number) => {
  const series = await seriesRepository.findOne({ ctx, seriesId: id })
  if (!series) {
    throw new NotFoundError()
  }

  return series
}

const RE_SYNC_AFTER_DAYS = 7

export const syncSeasonsAndEpisodesFromOMDb = async ({
  ctx,
  seriesId,
  imdbId,
  totalNumberOfSeasons,
}: {
  ctx: Context
  seriesId: number
  imdbId: string
  totalNumberOfSeasons: number
}) => {
  const existingSeasonsAndEpisodes =
    await episodeRepository.findEpisodesAndSeasonsForSeries({ ctx, seriesId })

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
    const newSeasons = await seasonRepository.createMany({
      ctx,
      seasons: createArrayOfLength(newSeasonsCount)
        .map((_, i) => i + 1 + existingSeasonsCount)
        .map((number) => ({
          number,
          seriesId,
        })),
    })

    newSeasons.forEach((season) => {
      seasonIdsByNumber[season.number] = season.id
    })
  }

  await Promise.all(
    createArrayOfLength(totalNumberOfSeasons)
      .map((_, i) => i + 1)
      .map(async (seasonNumber) => {
        const season = await omdbService.fetchSeasonDetailsFromOMDb({
          imdbId,
          seasonNumber,
        })
        const notSavedEpisodes = season.Episodes.filter(
          (episode) => !existingEpisodeImdbIds.has(episode.imdbID),
        )
        if (!notSavedEpisodes.length) {
          return
        }

        // TODO: Update existing episodes
        return await episodeRepository.createMany({
          ctx,
          episodes: notSavedEpisodes.map((episode) => ({
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
        })
      }),
  )
}

/**
 * Update the details of the series with the given IMDB ID from the OMDb API.
 * This also syncs the seasons and episodes from OMDb, saving them into the
 * database if needed.
 */
export const syncSeriesDetailsFromOMDb = async ({
  ctx,
  imdbId,
}: {
  ctx: Context
  imdbId: string
}) => {
  const newSeries = await omdbService.fetchSeriesDetailsFromOMDb({ imdbId })

  const savedSeries = await seriesRepository.updateOneByIMDbId({
    ctx,
    imdbId,
    series: {
      ...parseSeriesFromOMDbResponse(newSeries),
      syncedAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
  })
  if (!savedSeries) {
    throw new NotFoundError()
  }

  const totalNumberOfSeasons = parseInt(newSeries.totalSeasons)

  if (totalNumberOfSeasons) {
    await syncSeasonsAndEpisodesFromOMDb({
      ctx,
      imdbId: savedSeries.imdbId,
      seriesId: savedSeries.id,
      totalNumberOfSeasons,
    })
  }

  return savedSeries
}

export const getSeriesByIdAndFetchDetailsFromOmdb = async ({
  ctx,
  id,
}: {
  ctx: Context
  id: number
}) => {
  const series = await getSeriesById(ctx)(id)

  if (
    series.syncedAt &&
    isFuture(addDays(series.syncedAt, RE_SYNC_AFTER_DAYS))
  ) {
    return series
  }

  return await syncSeriesDetailsFromOMDb({ ctx, imdbId: series.imdbId })
}

export const updateSeriesStatusForUser = async ({
  ctx,
  input,
}: {
  ctx: AuthenticatedContext
  input: SeriesUpdateStatusInput
}) => {
  const series = await seriesRepository.findOne({
    ctx,
    seriesId: input.seriesId,
  })
  if (!series) {
    throw new NotFoundError()
  }

  if (!input.status) {
    await userSeriesStatusRepository.deleteOne({
      ctx,
      seriesId: series.id,
      userId: ctx.currentUser.id,
    })
    return series
  }

  const status = UserSeriesStatus[input.status]

  await userSeriesStatusRepository.createOrUpdate({
    ctx,
    userId: ctx.currentUser.id,
    seriesId: series.id,
    status,
  })

  return series
}

export const findStatusForSeries = async ({
  ctx,
  seriesIds,
}: {
  ctx: Context
  seriesIds: number[]
}): Promise<(UserSeriesStatus | null)[]> => {
  if (!ctx.currentUser) {
    return seriesIds.map(() => null)
  }

  const allStatuses = await userSeriesStatusRepository.findMany({
    ctx,
    seriesIds,
    userId: ctx.currentUser.id,
  })

  const statusesBySeriesId = keyBy(allStatuses, 'seriesId')

  return seriesIds.map((seriesId) => {
    const status = statusesBySeriesId[seriesId].status
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return status ? UserSeriesStatus[status] : null
  })
}

export const findUserSeries = ({
  ctx,
  status,
}: {
  ctx: AuthenticatedContext
  status?: UserSeriesStatus
}) => {
  return seriesRepository.findManyForUser({
    ctx,
    userId: ctx.currentUser.id,
    status,
  })
}

export const findOne = ({
  ctx,
  seriesId,
  imdbId,
  episodeId,
}: {
  ctx: Context
  seriesId?: number
  imdbId?: string
  episodeId?: number
}) => {
  return seriesRepository.findOne({ ctx, seriesId, imdbId, episodeId })
}
