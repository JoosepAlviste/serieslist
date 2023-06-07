import keyBy from 'lodash/keyBy'

import { episodesService, seasonService } from '@/features/series'
import { NotFoundError } from '@/lib/errors'
import { type Context, type AuthenticatedContext } from '@/types/context'

import * as seenEpisodeRepository from './seenEpisode.repository'
import * as seriesProgressRepository from './seriesProgress.repository'

export const toggleEpisodeSeen = async ({
  ctx,
  episodeId,
}: {
  ctx: AuthenticatedContext
  episodeId: number
}) => {
  const episode = await episodesService.findOne({ ctx, episodeId })
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

    await advanceSeriesProgress({
      ctx,
      latestSeenEpisodeId: episode.id,
    })
  } else {
    await seenEpisodeRepository.deleteOne({
      ctx,
      userId: ctx.currentUser.id,
      episodeId: episode.id,
    })

    await decreaseSeriesProgress({
      ctx,
      previousLatestSeenEpisodeId: episode.id,
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

export const advanceSeriesProgress = async ({
  ctx,
  latestSeenEpisodeId,
}: {
  ctx: AuthenticatedContext
  latestSeenEpisodeId: number
}) => {
  const latestEpisode = await episodesService.findOneWithSeasonAndSeriesInfo({
    ctx,
    episodeId: latestSeenEpisodeId,
  })
  if (!latestEpisode) {
    throw new NotFoundError()
  }

  const nextEpisode = await episodesService.findNextEpisode({
    ctx,
    seriesId: latestEpisode.seriesId,
    seasonNumber: latestEpisode.seasonNumber,
    episodeNumber: latestEpisode.number,
  })

  await seriesProgressRepository.createOrUpdateOne({
    ctx,
    seriesProgress: {
      seriesId: latestEpisode.seriesId,
      userId: ctx.currentUser.id,
      latestSeenEpisodeId: latestSeenEpisodeId,
      nextEpisodeId: nextEpisode?.id,
    },
  })
}

export const decreaseSeriesProgress = async ({
  ctx,
  previousLatestSeenEpisodeId,
}: {
  ctx: AuthenticatedContext
  previousLatestSeenEpisodeId: number
}) => {
  const previousLatestEpisode =
    await episodesService.findOneWithSeasonAndSeriesInfo({
      ctx,
      episodeId: previousLatestSeenEpisodeId,
    })
  if (!previousLatestEpisode) {
    throw new NotFoundError()
  }

  const previousEpisode = await episodesService.findPreviousEpisode({
    ctx,
    episode: previousLatestEpisode,
    seasonNumber: previousLatestEpisode.seasonNumber,
    seriesId: previousLatestEpisode.seriesId,
  })

  if (previousEpisode) {
    await seriesProgressRepository.createOrUpdateOne({
      ctx,
      seriesProgress: {
        seriesId: previousLatestEpisode.seriesId,
        userId: ctx.currentUser.id,
        nextEpisodeId: previousLatestSeenEpisodeId,
        latestSeenEpisodeId: previousEpisode.id,
      },
    })
  } else {
    await seriesProgressRepository.deleteOne({
      ctx,
      seriesId: previousLatestEpisode.seriesId,
      userId: ctx.currentUser.id,
    })
  }
}
