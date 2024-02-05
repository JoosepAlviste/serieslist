import { z } from 'zod'

export const tmdbStatusSchema = z.enum([
  'Returning Series',
  'In Production',
  'Ended',
  'Canceled',
])

export const tmdbSeriesSchema = z.object({
  id: z.number(),
  name: z.string(),
  external_ids: z.object({
    imdb_id: z.string().nullable(),
  }),
  poster_path: z.string().nullable(),
  overview: z.string(),
  number_of_seasons: z.number(),
  episode_run_time: z.array(z.number()),
  first_air_date: z.coerce.date().or(z.string().length(0)),
  last_air_date: z.coerce.date().nullable(),
  status: tmdbStatusSchema,

  seasons: z.array(
    z.object({
      id: z.number(),
      season_number: z.number(),
      name: z.string(),
    }),
  ),
})

export const tmdbSearchSeriesSchema = tmdbSeriesSchema.pick({
  id: true,
  overview: true,
  name: true,
  first_air_date: true,
  poster_path: true,
})

export const tmdbEpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  air_date: z.coerce.date().nullable(),
  episode_number: z.number(),
})

export const tmdbSeasonSchema = z.object({
  id: z.number(),
  name: z.string(),
  season_number: z.number(),
  episodes: z.array(tmdbEpisodeSchema),
  air_date: z.coerce.date(),
})
