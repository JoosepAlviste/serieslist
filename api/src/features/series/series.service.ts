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
      .select(['id', 'imdbId', 'title', 'poster', 'startYear', 'endYear'])
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
        newSeriesToAdd.map((series) => {
          // NOTE: This is not a regular dash, but an en-dash
          const [startYear, endYear] = series.Year.split('–')

          return {
            imdbId: series.imdbID,
            title: series.Title,
            startYear: parseInt(startYear, 10),
            endYear: endYear ? parseInt(endYear, 10) : null,
            poster: series.Poster,
          }
        }),
      )
      .returning(['id', 'imdbId', 'title', 'poster', 'startYear', 'endYear'])
      .execute()

    return [...existingSeries, ...newSeries]
  }
