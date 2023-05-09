import { searchSeriesFromOMDb } from '@/features/omdb'
import { type SeriesSearchInput } from '@/generated/gql/graphql'
import { type Context } from '@/types/context'

export const searchSeries =
  (ctx: Context) => async (input: SeriesSearchInput) => {
    const seriesFromOMDb = await searchSeriesFromOMDb(input.keyword)
    if (!seriesFromOMDb.length) {
      return []
    }

    const existingSeries = await ctx.db
      .selectFrom('series')
      .select(['id', 'imdbId', 'title'])
      .where(
        'imdbId',
        'in',
        seriesFromOMDb.map((series) => series.imdbID),
      )
      .execute()
    const existingSeriesImdbIds = existingSeries.map((series) => series.imdbId)

    const newSeriesToAdd = seriesFromOMDb.filter(
      (series) => !existingSeriesImdbIds.includes(series.imdbID),
    )
    if (!newSeriesToAdd.length) {
      return existingSeries
    }

    const newSeries = await ctx.db
      .insertInto('series')
      .values(
        newSeriesToAdd.map((series) => ({
          imdbId: series.imdbID,
          title: series.Title,
          startYear: 2000,
        })),
      )
      .returning(['id', 'imdbId', 'title'])
      .execute()

    return [...existingSeries, ...newSeries]
  }
