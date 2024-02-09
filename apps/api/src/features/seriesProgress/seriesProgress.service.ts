import { NotFoundError } from '@serieslist/core-graphql-server'
import type {
  Context,
  AuthenticatedContext,
} from '@serieslist/core-graphql-server'
import { isTruthy } from '@serieslist/util-arrays'
import index from 'just-index'

import * as episodesService from '#/features/series/episodes.service'
import * as seasonService from '#/features/series/season.service'

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

/**
 * @returns Series ID
 */
export const markSeriesEpisodesAsSeen = async ({
  ctx,
  seriesId,
}: {
  ctx: AuthenticatedContext
  seriesId: number
}) => {
  const episodes = await episodesService.findEpisodesSeries({
    ctx,
    seriesId: seriesId,
  })

  await seenEpisodeRepository.createMany({
    ctx,
    seenEpisodes: episodes.map((episode) => ({
      episodeId: episode.id,
      userId: ctx.currentUser.id,
    })),
  })

  const lastEpisode = await episodesService.findLastEpisodeOfSeries({
    ctx,
    seriesId,
  })
  if (lastEpisode) {
    await seriesProgressRepository.createOrUpdateOne({
      ctx,
      seriesProgress: {
        seriesId,
        userId: ctx.currentUser.id,
        latestSeenEpisodeId: lastEpisode.id,
        nextEpisodeId: null,
      },
    })
  }

  return seriesId
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

  const seenEpisodesByEpisodeId = index(seenEpisodes, 'episodeId')

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
        seasonNumber: firstNotSeenEpisode.season.number,
        episode: firstNotSeenEpisode.episode,
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
      nextEpisodeId: firstNotSeenEpisode?.episode.id ?? null,
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
  const seenEpisodesBySeriesIds = index(seenEpisodes, 'seriesId')

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
  const episodesByIds = index(episodes, 'id')

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
  const seenEpisodesBySeriesIds = index(seenEpisodes, 'seriesId')
  if (!seenEpisodes.length) {
    const firstEpisodes = await episodesService.findFirstEpisodesForSeries({
      ctx,
      seriesIds,
    })

    return seriesIds.map((seriesId) => firstEpisodes[seriesId])
  }

  const nextEpisodeIds = seenEpisodes
    .map((seenEpisode) => seenEpisode.nextEpisodeId)
    .filter(isTruthy)
  if (!nextEpisodeIds.length) {
    return seriesIds.map(() => null)
  }

  const episodes = await episodesService.findMany({
    ctx,
    episodeIds: nextEpisodeIds,
    releasedBefore: new Date(Date.now()),
  })
  const episodesByIds = index(episodes, 'id')

  const seriesWithNoProgress = seriesIds.filter((seriesId) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return !seenEpisodesBySeriesIds[seriesId]
  })
  const firstEpisodes = seriesWithNoProgress.length
    ? await episodesService.findFirstEpisodesForSeries({
        ctx,
        seriesIds: seriesWithNoProgress,
      })
    : {}

  return seriesIds.map((seriesId) => {
    const progress = seenEpisodesBySeriesIds[seriesId]
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return progress?.nextEpisodeId
      ? episodesByIds[progress.nextEpisodeId]
      : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        firstEpisodes[seriesId] ?? null
  })
}
