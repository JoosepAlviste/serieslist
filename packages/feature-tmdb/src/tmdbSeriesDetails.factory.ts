import { faker } from '@faker-js/faker'
import { subDays } from 'date-fns'
import { Factory } from 'fishery'
import { nanoid } from 'nanoid'
import type { z } from 'zod'

import type { TMDBSeason, TMDBEpisode, TMDBSeries } from './tmdb.types'
import type { tmdbNotFoundSchema } from './tmdbRequests.schema'

export const tmdbSeriesDetailsFactory = Factory.define<TMDBSeries>(() => ({
  id: faker.number.int(9999999),
  name: 'Test Series',
  poster_path: 'foo.jpg',
  overview: 'Test plot.',
  first_air_date: '2023-05-06',

  // Details
  number_of_seasons: 0,
  episode_run_time: [22],
  last_air_date: null,
  status: 'Returning Series',
  seasons: [],
  external_ids: {
    imdb_id: `tt${nanoid(12)}`,
  },
}))

export const tmdbEpisodeFactory = Factory.define<TMDBEpisode>(
  ({ sequence }) => ({
    id: faker.number.int(9999999),
    episode_number: sequence,
    name: 'Test Episode',
    air_date: subDays(new Date(Date.now()), 2),
  }),
)

export const tmdbSeasonFactory = Factory.define<TMDBSeason>(
  ({ sequence, params }) => ({
    id: faker.number.int(9999999),
    season_number: sequence,
    name: `Season ${params.season_number ?? sequence}`,
    air_date: new Date(Date.now()),

    // Details
    episodes: [],
  }),
)

export const tmdbNotFoundResponseFactory = Factory.define<
  z.infer<typeof tmdbNotFoundSchema>
>(() => ({
  status_code: 34,
  success: false,
  status_message: 'The resource you requested could not be found.',
}))
