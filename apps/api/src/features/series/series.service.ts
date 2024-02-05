import { UserSeriesStatusStatus } from '@serieslist/core-db'
import { NotFoundError } from '@serieslist/core-graphql-server'
import type {
  AuthenticatedContext,
  Context,
} from '@serieslist/core-graphql-server'
import {
  shouldSyncSeries,
  syncSeriesDetails,
} from '@serieslist/feature-series-sync'
import { tmdbService } from '@serieslist/feature-tmdb'
import index from 'just-index'

import type {
  SeriesUpdateStatusInput,
  SeriesSearchInput,
} from '#/generated/gql/graphql'

import * as seriesRepository from './series.repository'
import * as userSeriesStatusRepository from './userSeriesStatus.repository'

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

export const getSeriesByIdAndFetchDetailsFromTMDB = async ({
  ctx,
  id,
}: {
  ctx: Context
  id: number
}) => {
  const series = await getSeriesById(ctx)(id)

  if (shouldSyncSeries(series)) {
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

  const status = UserSeriesStatusStatus[input.status]

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
}): Promise<(UserSeriesStatusStatus | null)[]> => {
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
    return status ? UserSeriesStatusStatus[status] : null
  })
}

export const findUserSeries = ({
  ctx,
  status,
}: {
  ctx: AuthenticatedContext
  status?: UserSeriesStatusStatus
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
