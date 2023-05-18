import { type z } from 'zod'

import {
  type omdbSeriesSchema,
  type omdbSearchSeriesSchema,
  type omdbEpisodeSchema,
  type omdbSeasonSchema,
} from './omdb.schemas'

export type OMDbSearchSeries = z.infer<typeof omdbSearchSeriesSchema>

export type OMDbSeries = z.infer<typeof omdbSeriesSchema>

export type OMDbSeason = z.infer<typeof omdbSeasonSchema>

export type OMDbEpisode = z.infer<typeof omdbEpisodeSchema>
