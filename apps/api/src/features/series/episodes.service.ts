import type { Episode } from '@serieslist/db'
import type { DBContext, Context } from '@serieslist/graphql-server'
import index from 'just-index'

import { groupEntitiesByKeyToNestedArray } from '#/utils/groupEntitiesByKeyToNestedArray'

import * as episodeRepository from './episode.repository'

export const findOne = ({
  ctx,
  episodeId,
}: {
  ctx: Context
  episodeId: number
}) => {
  return episodeRepository.findOne({ ctx, episodeId })
}

export const findMany = ({
  ctx,
  seasonIds,
  episodeIds,
  releasedBefore,
}: {
  ctx: Context
  seasonIds?: number[]
  episodeIds?: number[]
  releasedBefore?: Date
}) => {
  return episodeRepository.findMany({
    ctx,
    seasonIds,
    episodeIds,
    releasedBefore,
  })
}

export const findEpisodesBySeasonIds = async ({
  ctx,
  seasonIds,
}: {
  ctx: Context
  seasonIds: number[]
}) => {
  const allEpisodes = await episodeRepository.findMany({
    ctx,
    seasonIds,
  })

  return groupEntitiesByKeyToNestedArray({
    entities: allEpisodes,
    ids: seasonIds,
    fieldToGroupBy: 'seasonId',
  })
}

export const findEpisodesAndSeasonsForSeries = ({
  ctx,
  seriesId,
}: {
  ctx: Context
  seriesId: number
}) => {
  return episodeRepository.findEpisodesAndSeasonsForSeries({ ctx, seriesId })
}

/**
 * It is often needed to have a season number, series id, and episode data in
 * one go.
 */
export const findOneWithSeasonAndSeriesInfo = ({
  ctx,
  episodeId,
}: {
  ctx: Context
  episodeId: number
}) => {
  return episodeRepository.findOneWithSeasonAndSeriesInfo({ ctx, episodeId })
}

export const findNextEpisode = async ({
  ctx,
  seriesId,
  seasonNumber,
  episodeNumber,
}: {
  ctx: Context
  seriesId: number
  seasonNumber: number
  episodeNumber: number
}) => {
  return episodeRepository.findNextEpisode({
    ctx,
    seriesId,
    seasonNumber,
    episodeNumber,
  })
}

export const findPreviousEpisode = async ({
  ctx,
  episode,
  seasonNumber,
  seriesId,
}: {
  ctx: Context
  episode: Episode
  seasonNumber: number
  seriesId: number
}) => {
  const [episodeAndSeason] =
    await episodeRepository.findManyByNumberForManySeries({
      ctx,
      seriesIds: [seriesId],
      seasonNumber: seasonNumber,
      episodeNumber: episode.number - 1,
    })
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (episodeAndSeason) {
    return episodeAndSeason.episode
  }

  const previousSeasonLastEpisode =
    await episodeRepository.findLastEpisodeOfSeason({
      ctx,
      seriesId: seriesId,
      seasonNumber: seasonNumber - 1,
    })

  return previousSeasonLastEpisode
}

export const findLastEpisodeOfSeries = ({
  ctx,
  seriesId,
}: {
  ctx: Context
  seriesId: number
}) => {
  return episodeRepository.findLastEpisodeOfSeries({
    ctx,
    seriesId,
  })
}

export const findFirstNotSeenEpisodeInSeriesForUser = async ({
  ctx,
  seriesId,
  userId,
}: {
  ctx: Context
  seriesId: number
  userId: number
}) => {
  return episodeRepository.findFirstNotSeenEpisodeInSeriesForUser({
    ctx,
    seriesId,
    userId,
  })
}

export const findFirstEpisodesForSeries = async ({
  ctx,
  seriesIds,
}: {
  ctx: Context
  seriesIds: number[]
}) => {
  const episodes = await episodeRepository.findManyByNumberForManySeries({
    ctx,
    seriesIds,
    seasonNumber: 1,
    episodeNumber: 1,
  })

  return index(
    episodes.map((e) => ({ ...e.episode, seriesId: e.season.seriesId })),
    'seriesId',
  )
}

export const deleteMany = async ({
  ctx,
  episodeIds,
}: {
  ctx: DBContext
  episodeIds: number[]
}) => {
  if (!episodeIds.length) {
    return
  }

  return episodeRepository.deleteMany({ ctx, episodeIds })
}
