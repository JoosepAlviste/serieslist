import { z } from 'zod'

export const omdbSeriesSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  imdbID: z.string(),
  Poster: z.string(),
  Runtime: z.string(),
  Plot: z.string(),
  imdbRating: z.string(),
  totalSeasons: z.string(),
})

export const omdbSearchSeriesSchema = omdbSeriesSchema.pick({
  Title: true,
  Year: true,
  imdbID: true,
  Poster: true,
})

export const omdbSeriesSearchResponseSchema = z
  .object({
    Search: z.array(omdbSearchSeriesSchema),
  })
  .or(
    z.object({
      Response: z.string(),
      Error: z.string(),
    }),
  )

export const omdbEpisodeSchema = z.object({
  Title: z.string(),
  Released: z.string(),
  Episode: z.string(),
  imdbID: z.string(),
  imdbRating: z.string(),
})

export const omdbSeasonSchema = z.object({
  Season: z.string(),
  Episodes: z.array(omdbEpisodeSchema),
})
