import type { z } from 'zod'

import type {
  tmdbSeriesSchema,
  tmdbSearchSeriesSchema,
  tmdbEpisodeSchema,
  tmdbSeasonSchema,
} from './tmdb.schema'
import type {
  tmdbSeriesSearchResponseSchema,
  tmdbSeriesResponseSchema,
  tmdbSeasonResponseSchema,
} from './tmdbRequests.schema'

export type TMDBSearchResponse = z.infer<typeof tmdbSeriesSearchResponseSchema>

export type TMDBSearchSeries = z.infer<typeof tmdbSearchSeriesSchema>

export type TMDBSeries = z.infer<typeof tmdbSeriesSchema>

export type TMDBSeriesResponse = z.infer<typeof tmdbSeriesResponseSchema>

export type TMDBSeason = z.infer<typeof tmdbSeasonSchema>

export type TMDBSeasonResponse = z.infer<typeof tmdbSeasonResponseSchema>

export type TMDBEpisode = z.infer<typeof tmdbEpisodeSchema>

export type TMDBParsedSeries = {
  tmdbId: number
  title: string
  imdbId: string | null
  poster: string | null
  plot: string | null
  startYear: number | null
  endYear: number | null
}

export type TMDBParsedSeason = {
  number: number
  tmdbId: number
  title: string
}

export type TMDBParsedEpisode = {
  tmdbId: number
  number: number
  title: string
  releasedAt: Date | null
}
