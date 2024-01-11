import { z } from 'zod'

import {
  tmdbSeriesSchema,
  tmdbSeasonSchema,
  tmdbSearchSeriesSchema,
} from './tmdb.schema'

export const tmdbNotFoundSchema = z.object({
  success: z.literal(false),
  status_code: z.literal(34),
  status_message: z.string(),
})

export const tmdbSeriesResponseSchema = tmdbSeriesSchema.or(tmdbNotFoundSchema)

export const tmdbSeriesSearchResponseSchema = z.object({
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
  results: z.array(tmdbSearchSeriesSchema),
})

export const tmdbSeasonResponseSchema = tmdbSeasonSchema.or(tmdbNotFoundSchema)
