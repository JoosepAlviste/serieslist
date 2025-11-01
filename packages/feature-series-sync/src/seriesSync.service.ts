import type { InsertSeason, Series } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { tmdbService } from '@serieslist/feature-tmdb'
import { isTruthy } from '@serieslist/util-arrays'
import { addDays, isPast, subDays } from 'date-fns'
import index from 'just-index'
import unique from 'just-unique'

import * as episodeRepository from './episode.repository'
import { log } from './lib/logger'
import * as seasonRepository from './season.repository'
import * as seriesRepository from './series.repository'
import * as seriesProgressRepository from './seriesProgress.repository'

const RE_SYNC_AFTER_DAYS = 7

export const shouldSyncSeries = (series: Pick<Series, 'syncedAt'>) => {
  if (!series.syncedAt) {
    return true
  }

  return isPast(addDays(series.syncedAt, RE_SYNC_AFTER_DAYS))
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
  seasons: Omit<InsertSeason, 'seriesId'>[]
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

  const episodeIdsToDelete: number[] = []

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
        await seasonRepository.deleteOne({
          ctx,
          seasonId: seasonsByNumber[seasonNumber].seasonId,
        })
        return
      }

      const existingEpisodesInSeason = existingSeasonsAndEpisodes.filter(
        (episode) => episode.seasonNumber === parseInt(seasonNumber),
      )
      if (!episodes.length) {
        episodeIdsToDelete.push(
          ...existingEpisodesInSeason
            .map((episode) => episode.episodeId)
            .filter(isTruthy),
        )
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

      const existingEpisodesDeletedFromTMDB = existingEpisodesInSeason.filter(
        (episode) =>
          !savedAndUpdatedEpisodes.find(
            (newEpisode) => newEpisode.id === episode.episodeId,
          ),
      )

      episodeIdsToDelete.push(
        ...existingEpisodesDeletedFromTMDB
          .map((episode) => episode.episodeId)
          .filter(isTruthy),
      )

      return savedAndUpdatedEpisodes
    }),
  )

  if (episodeIdsToDelete.length) {
    await episodeRepository.deleteMany({
      ctx,
      episodeIds: episodeIdsToDelete,
    })
  }

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

    await seriesProgressRepository.updateMany({
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

  const savedSeries = await seriesRepository.updateOneByTMDBId({
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

  log.info(
    {
      title: savedSeries.title,
      seriesId: savedSeries.id,
    },
    'Synced series',
  )

  return savedSeries
}

export const reSyncSeries = async ({ ctx }: { ctx: DBContext }) => {
  const seriesToSync = await seriesRepository.findMany({
    ctx,
    syncedAtBefore: subDays(new Date(Date.now()), RE_SYNC_AFTER_DAYS),
  })

  for (const series of seriesToSync) {
    await syncSeriesDetails({ ctx, tmdbId: series.tmdbId })
  }
}
