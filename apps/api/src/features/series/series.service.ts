import { addDays, isFuture, subDays } from 'date-fns'
import index from 'just-index'
import unique from 'just-unique'
import { type Insertable } from 'kysely'

import { seriesProgressService } from '@/features/seriesProgress'
import { tmdbService } from '@/features/tmdb'
import { type Season } from '@/generated/db'
import {
  type SeriesUpdateStatusInput,
  type SeriesSearchInput,
} from '@/generated/gql/graphql'
import { NotFoundError } from '@/lib/errors'
import { log } from '@/lib/logger'
import {
  type DBContext,
  type AuthenticatedContext,
  type Context,
} from '@/types/context'

import { UserSeriesStatus } from './constants'
import * as episodeRepository from './episode.repository'
import * as seasonRepository from './season.repository'
import * as seasonService from './season.service'
import * as seriesRepository from './series.repository'
import * as userSeriesStatusRepository from './userSeriesStatus.repository'

const RE_SYNC_AFTER_DAYS = 7

export const searchSeries = async ({
  ctx,
  input,
}: {
  ctx: Context
  input: SeriesSearchInput
}) => {
  const seriesFromTMDB = await tmdbService.searchSeries({
    keyword: input.keyword,
  })
  if (!seriesFromTMDB.length) {
    return []
  }

  const existingSeries = await seriesRepository.findMany({
    ctx,
    tmdbIds: seriesFromTMDB.map((series) => series.tmdbId),
  })
  const existingSeriesTmdbIds = existingSeries.map((series) => series.tmdbId)

  const newSeriesToAdd = seriesFromTMDB.filter(
    (series) => !existingSeriesTmdbIds.includes(series.tmdbId),
  )
  if (!newSeriesToAdd.length) {
    return existingSeries
  }

  const newSeries = await seriesRepository.createMany({
    ctx,
    series: newSeriesToAdd,
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

export const syncSeasonsAndEpisodes = async ({
  ctx,
  seriesId,
  tmdbId,
  seasons,
}: {
  ctx: DBContext
  seriesId: number
  tmdbId: number
  seasons: Omit<Insertable<Season>, 'seriesId'>[]
}) => {
  const existingSeasonsAndEpisodes =
    await episodeRepository.findEpisodesAndSeasonsForSeries({ ctx, seriesId })

  const seasonsByNumber = index(existingSeasonsAndEpisodes, 'seasonNumber')

  const existingSeasonTmdbIds = unique(
    existingSeasonsAndEpisodes.map(({ seasonTmdbId }) => seasonTmdbId),
  )
  const existingEpisodeTmdbIds = new Set(
    existingSeasonsAndEpisodes.map(({ episodeTmdbId }) => episodeTmdbId),
  )

  const newSeasons = seasons.filter(
    (season) => !existingSeasonTmdbIds.includes(season.tmdbId),
  )

  if (newSeasons.length > 0) {
    const savedNewSeasons = await seasonRepository.createMany({
      ctx,
      seasons: newSeasons.map((season) => ({
        tmdbId: season.tmdbId,
        number: season.number,
        title: season.title,
        seriesId,
      })),
    })

    savedNewSeasons.forEach((season) => {
      seasonsByNumber[season.number] = {
        seasonId: season.id,
        seasonTmdbId: season.tmdbId,
        seasonNumber: season.number,
        episodeId: null,
        episodeTmdbId: null,
      }
    })
  }

  const newEpisodes: {
    episodeId: number
    seasonNumber: number
    episodeNumber: number
  }[] = []

  await Promise.all(
    Object.keys(seasonsByNumber).map(async (seasonNumber) => {
      const { parsed, found, episodes } =
        await tmdbService.fetchEpisodesForSeason({
          tmdbId,
          seasonNumber: parseInt(seasonNumber),
        })
      if (!parsed) {
        return
      }
      if (!found) {
        await seasonService.deleteOne({
          ctx,
          seasonId: seasonsByNumber[seasonNumber].seasonId,
        })
        return
      }

      if (!episodes.length) {
        return
      }

      const savedAndUpdatedEpisodes =
        await episodeRepository.createOrUpdateMany({
          ctx,
          episodes: episodes.map((episode) => ({
            ...episode,
            seasonId: seasonsByNumber[seasonNumber].seasonId,
          })),
        })

      savedAndUpdatedEpisodes.forEach((episode) => {
        // Only add actually new episodes to the newEpisodes, not updated ones
        if (!existingEpisodeTmdbIds.has(episode.tmdbId)) {
          newEpisodes.push({
            episodeId: episode.id,
            episodeNumber: episode.number,
            seasonNumber: parseInt(seasonNumber),
          })
        }
      })

      return savedAndUpdatedEpisodes
    }),
  )

  if (newEpisodes.length) {
    newEpisodes.sort((a, b) => {
      if (a.seasonNumber < b.seasonNumber) {
        return -1
      } else if (a.episodeNumber < b.episodeNumber) {
        return -1
      }
      return 1
    })
    const firstNewEpisode = newEpisodes[0]

    await seriesProgressService.updateMany({
      ctx,
      seriesId,
      nextEpisodeId: null,
      seriesProgress: {
        nextEpisodeId: firstNewEpisode.episodeId,
      },
    })
  }
}

/**
 * Update the details of the series with the given TMDB ID from the TMDB API.
 * This also syncs the seasons and episodes from TMDB, saving them into the
 * database if needed.
 *
 * If the series does not exist on TMDB, then it will be deleted from the
 * database.
 */
export const syncSeriesDetails = async ({
  ctx,
  tmdbId,
}: {
  ctx: DBContext
  tmdbId: number
}) => {
  const {
    parsed,
    found,
    series: newSeries,
    totalSeasons,
    seasons,
  } = await tmdbService.fetchSeriesDetails({ tmdbId })
  if (!parsed) {
    return null
  }

  if (!found) {
    await seriesRepository.deleteOne({ ctx, tmdbId })
    return null
  }

  const savedSeries = await seriesRepository.updateOneByTMDbId({
    ctx,
    tmdbId,
    series: {
      ...newSeries,
      syncedAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    },
  })
  if (!savedSeries) {
    return null
  }

  if (totalSeasons) {
    await syncSeasonsAndEpisodes({
      ctx,
      tmdbId: savedSeries.tmdbId,
      seriesId: savedSeries.id,
      seasons,
    })
  }

  log.info(`Synced series "${savedSeries.title}" (${savedSeries.id})`)

  return savedSeries
}

export const getSeriesByIdAndFetchDetailsFromTMDB = async ({
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

  const syncedSeries = await syncSeriesDetails({ ctx, tmdbId: series.tmdbId })
  if (!syncedSeries) {
    throw new NotFoundError()
  }

  return series
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

  const statusesBySeriesId = index(allStatuses, 'seriesId')

  return seriesIds.map((seriesId) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const status = statusesBySeriesId[seriesId]?.status
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

export const findMany = async ({
  ctx,
  tmdbIds,
  seriesIds,
}: {
  ctx: Context
  tmdbIds?: number[]
  seriesIds?: number[]
}) => {
  const series = await seriesRepository.findMany({ ctx, tmdbIds, seriesIds })

  if (seriesIds) {
    return series
      .slice()
      .sort((a, b) => seriesIds.indexOf(a.id) - seriesIds.indexOf(b.id))
  }

  return series
}

export const reSyncSeries = async ({ ctx }: { ctx: DBContext }) => {
  const seriesToSync = await seriesRepository.findMany({
    ctx,
    syncedAtBefore: subDays(new Date(Date.now()), RE_SYNC_AFTER_DAYS),
    orderBySyncedAt: 'asc',
  })

  for (const series of seriesToSync) {
    await syncSeriesDetails({ ctx, tmdbId: series.tmdbId })
  }
}
