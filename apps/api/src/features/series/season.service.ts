import type { DBContext } from '@serieslist/core-graphql-server'

import { groupEntitiesByKeyToNestedArray } from '#/utils/groupEntitiesByKeyToNestedArray'

import * as seasonRepository from './season.repository'

export const findOne = async ({
  ctx,
  seasonId,
}: {
  ctx: DBContext
  seasonId: number
}) => {
  return seasonRepository.findOne({ ctx, seasonId })
}

export const findMany = async ({
  ctx,
  seasonIds,
  seriesIds,
}: {
  ctx: DBContext
  seriesIds?: number[]
  seasonIds?: number[]
}) => {
  const seasons = await seasonRepository.findMany({ ctx, seriesIds, seasonIds })
  if (seasonIds) {
    return seasons
      .slice()
      .sort((a, b) => seasonIds.indexOf(a.id) - seasonIds.indexOf(b.id))
  }

  return seasons
}

export const findSeasonsBySeriesIds = async ({
  ctx,
  seriesIds,
}: {
  ctx: DBContext
  seriesIds: number[]
}) => {
  const allSeasons = await seasonRepository.findMany({ ctx, seriesIds })

  return groupEntitiesByKeyToNestedArray({
    entities: allSeasons,
    ids: seriesIds,
    fieldToGroupBy: 'seriesId',
  })
}
