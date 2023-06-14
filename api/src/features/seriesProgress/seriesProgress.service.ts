import { type UpdateObject } from 'kysely'
import keyBy from 'lodash/keyBy'

import { episodesService, seasonService } from '@/features/series'
import { type DB } from '@/generated/db'
import { NotFoundError } from '@/lib/errors'
import { type Context, type AuthenticatedContext } from '@/types/context'
import { isTruthy } from '@/utils/isTruthy'

import * as seenEpisodeRepository from './seenEpisode.repository'
import * as seriesProgressRepository from './seriesProgress.repository'

export const toggleEpisodeSeen = async ({
  ctx,
  episodeId,
}: {
  ctx: AuthenticatedContext
  episodeId: number
}) => {
  const episode = await episodesService.findOneWithSeasonAndSeriesInfo({
    ctx,
    episodeId,
  })
  if (!episode) {
    throw new NotFoundError()
  }

  const seenEpisode = await seenEpisodeRepository.findOne({
    ctx,
    episodeId,
    userId: ctx.currentUser.id,
  })

  if (!seenEpisode) {
    await seenEpisodeRepository.createOne({
      ctx,
      seenEpisode: {
        episodeId: episode.id,
        userId: ctx.currentUser.id,
      },
    })

    await recalculateSeriesProgress({
      ctx,
      seriesId: episode.seriesId,
    })
  } else {
    await seenEpisodeRepository.deleteOne({
      ctx,
      userId: ctx.currentUser.id,
      episodeId: episode.id,
    })

    await recalculateSeriesProgress({
      ctx,
      seriesId: episode.seriesId,
    })
  }

  return episode
}

export const markSeasonEpisodesAsSeen = async ({
  ctx,
  seasonId,
}: {
  ctx: AuthenticatedContext
  seasonId: number
}) => {
  const season = await seasonService.findOne({
    ctx,
    seasonId,
  })
  if (!season) {
    throw new NotFoundError()
  }

  const episodes = await episodesService.findMany({
    ctx,
    seasonIds: [seasonId],
  })

  await seenEpisodeRepository.createMany({
    ctx,
    seenEpisodes: episodes.map((episode) => ({
      episodeId: episode.id,
      userId: ctx.currentUser.id,
    })),
  })

  if (episodes.length) {
    await recalculateSeriesProgress({
      ctx,
      seriesId: season.seriesId,
    })
  }

  return season
}

export const findIsSeenForEpisodes = async ({
  ctx,
  episodeIds,
}: {
  ctx: Context
  episodeIds: number[]
}) => {
  if (!ctx.currentUser?.id) {
    return episodeIds.map(() => false)
  }

  const seenEpisodes = await seenEpisodeRepository.findMany({
    ctx,
    userId: ctx.currentUser.id,
    episodeIds,
  })

  const seenEpisodesByEpisodeId = keyBy(seenEpisodes, 'episodeId')

  return episodeIds.map((episodeId) => {
    return Boolean(seenEpisodesByEpisodeId[episodeId])
  })
}

export const recalculateSeriesProgress = async ({
  ctx,
  seriesId,
}: {
  ctx: AuthenticatedContext
  seriesId: number
}) => {
  const firstNotSeenEpisode =
    await episodesService.findFirstNotSeenEpisodeInSeriesForUser({
      ctx,
      seriesId,
      userId: ctx.currentUser.id,
    })

  const lastSeenEpisode = firstNotSeenEpisode
    ? await episodesService.findPreviousEpisode({
        ctx,
        seriesId,
        seasonNumber: firstNotSeenEpisode.seasonNumber,
        episode: firstNotSeenEpisode,
      })
    : await episodesService.findLastEpisodeOfSeries({
        ctx,
        seriesId,
      })
  if (!lastSeenEpisode) {
    await seriesProgressRepository.deleteOne({
      ctx,
      seriesId,
      userId: ctx.currentUser.id,
    })
    return
  }

  await seriesProgressRepository.createOrUpdateOne({
    ctx,
    seriesProgress: {
      seriesId,
      userId: ctx.currentUser.id,
      latestSeenEpisodeId: lastSeenEpisode.id,
      nextEpisodeId: firstNotSeenEpisode?.id ?? null,
    },
  })
}

export const findLatestSeenEpisodesForSeries = async ({
  ctx,
  seriesIds,
}: {
  ctx: AuthenticatedContext
  seriesIds: number[]
}) => {
  const seenEpisodes = await seriesProgressRepository.findMany({
    ctx,
    seriesIds,
    userId: ctx.currentUser.id,
  })
  const seenEpisodesBySeriesIds = keyBy(seenEpisodes, 'seriesId')

  const episodeIds = seenEpisodes
    .map((seenEpisode) => seenEpisode.latestSeenEpisodeId)
    .filter(isTruthy)
  if (!episodeIds.length) {
    return seriesIds.map(() => null)
  }

  const episodes = await episodesService.findMany({
    ctx,
    episodeIds,
  })
  const episodesByIds = keyBy(episodes, 'id')

  return seriesIds.map((seriesId) => {
    const progress = seenEpisodesBySeriesIds[seriesId]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return progress?.latestSeenEpisodeId
      ? episodesByIds[progress.latestSeenEpisodeId]
      : null
  })
}

export const findNextEpisodesForSeries = async ({
  ctx,
  seriesIds,
}: {
  ctx: AuthenticatedContext
  seriesIds: number[]
}) => {
  const seenEpisodes = await seriesProgressRepository.findMany({
    ctx,
    seriesIds,
    userId: ctx.currentUser.id,
  })
  const seenEpisodesBySeriesIds = keyBy(seenEpisodes, 'seriesId')

  const episodeIds = seenEpisodes
    .map((seenEpisode) => seenEpisode.nextEpisodeId)
    .filter(isTruthy)
  if (!episodeIds.length) {
    return seriesIds.map(() => null)
  }

  const episodes = await episodesService.findMany({
    ctx,
    episodeIds,
  })
  const episodesByIds = keyBy(episodes, 'id')

  return seriesIds.map((seriesId) => {
    const progress = seenEpisodesBySeriesIds[seriesId]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return progress?.nextEpisodeId
      ? episodesByIds[progress.nextEpisodeId]
      : null
  })
}

export const updateMany = ({
  ctx,
  seriesId,
  nextEpisodeId,
  seriesProgress,
}: {
  ctx: Context
  seriesId: number
  nextEpisodeId: number | null
  seriesProgress: UpdateObject<DB, 'seriesProgress'>
}) => {
  return seriesProgressRepository.updateMany({
    ctx,
    seriesId,
    nextEpisodeId,
    seriesProgress,
  })
}
