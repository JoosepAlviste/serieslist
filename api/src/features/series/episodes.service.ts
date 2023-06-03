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
