import { Factory } from 'fishery'
import { type Selectable } from 'kysely'
import { nanoid } from 'nanoid'
import { type z } from 'zod'

import { type Series, type Episode } from '@/generated/db'
import { generateRandomInt } from '@/utils/generateRandomInt'

import { type tmdbNotFoundSchema } from './tmdb.schemas'
import { type TMDbSeason, type TMDbEpisode, type TMDbSeries } from './types'

type TMDBSeriesDetailsTransientParams = {
  savedSeries?: Selectable<Series>
}

export const tmdbSeriesDetailsFactory = Factory.define<
  TMDbSeries,
  TMDBSeriesDetailsTransientParams
>(({ transientParams: { savedSeries } }) => ({
  id: savedSeries?.tmdbId ?? generateRandomInt(1, 9999999),
  name: savedSeries?.title ?? 'Test Series',
  poster_path: savedSeries?.poster ?? 'foo.jpg',
  overview: savedSeries?.plot ?? 'Test plot.',
  first_air_date: `${savedSeries?.startYear ?? 2023}-05-06`,

  // Details
  number_of_seasons: 0,
  episode_run_time: [22],
  last_air_date: null,
  status: 'Returning Series',
  seasons: [],
  external_ids: {
    imdb_id: savedSeries?.imdbId ?? `tt${nanoid(12)}`,
  },
}))

type TMDBEpisodeTransientParams = {
  savedEpisode?: Selectable<Episode>
}

export const tmdbEpisodeFactory = Factory.define<
  TMDbEpisode,
  TMDBEpisodeTransientParams
>(({ sequence, transientParams: { savedEpisode } }) => ({
  id: savedEpisode?.tmdbId ?? generateRandomInt(1, 9999999),
  episode_number: savedEpisode?.number ? savedEpisode.number : sequence,
  name: savedEpisode?.title ?? 'Test Episode',
  air_date: savedEpisode?.releasedAt ?? new Date(Date.now()),
}))

export const tmdbSeasonFactory = Factory.define<TMDbSeason>(
  ({ sequence, params }) => ({
    id: generateRandomInt(1, 9999999),
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
