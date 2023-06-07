import { type Selectable } from 'kysely'

import { type Episode } from '@/generated/db'
import { type Context } from '@/types/context'
import { groupEntitiesByKeyToNestedArray } from '@/utils/groupEntitiesByKeyToNestedArray'

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
}: {
  ctx: Context
  seasonIds: number[]
}) => {
  return episodeRepository.findMany({ ctx, seasonIds })
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
  episode: Selectable<Episode>
  seasonNumber: number
  seriesId: number
}) => {
  const sameSeasonPreviousEpisode = await episodeRepository.findOneByNumber({
    ctx,
    seriesId: seriesId,
    seasonNumber: seasonNumber,
    episodeNumber: episode.number - 1,
  })
  if (sameSeasonPreviousEpisode) {
    return sameSeasonPreviousEpisode
  }

  const previousSeasonLastEpisode =
    await episodeRepository.findLastEpisodeOfSeason({
      ctx,
      seriesId: seriesId,
      seasonNumber: seasonNumber - 1,
    })

  return previousSeasonLastEpisode
}
