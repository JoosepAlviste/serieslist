import { searchSeriesFromOMDb } from '@/features/omdb'
import { type SeriesSearchInput } from '@/generated/gql/graphql'

export const searchSeries = async (input: SeriesSearchInput) => {
  const series = await searchSeriesFromOMDb(input.keyword)

  return series.map((serie, index) => ({
    id: index,
    imdbId: serie.imdbID,
    title: serie.Title,
  }))
}
