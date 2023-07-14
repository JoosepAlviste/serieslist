import { type z } from 'zod'

import {
  type tmdbSeriesSchema,
  type tmdbSearchSeriesSchema,
  type tmdbEpisodeSchema,
  type tmdbSeasonSchema,
  type tmdbSeriesSearchResponseSchema,
} from './tmdb.schemas'

export type TMDbSearchResponse = z.infer<typeof tmdbSeriesSearchResponseSchema>

export type TMDbSearchSeries = z.infer<typeof tmdbSearchSeriesSchema>

export type TMDbSeries = z.infer<typeof tmdbSeriesSchema>

export type TMDbSeason = z.infer<typeof tmdbSeasonSchema>

export type TMDbEpisode = z.infer<typeof tmdbEpisodeSchema>
