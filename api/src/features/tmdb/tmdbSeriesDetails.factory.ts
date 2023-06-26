import { Factory } from 'fishery'
import { type Selectable } from 'kysely'
import { nanoid } from 'nanoid'

import { type Episode } from '@/generated/db'
import { generateRandomInt } from '@/utils/generateRandomInt'

import { type TMDbSeason, type TMDbEpisode, type TMDbSeries } from './types'

export const tmdbSeriesDetailsFactory = Factory.define<TMDbSeries>(() => ({
  id: generateRandomInt(1, 9999999),
  name: 'Test Series',
  external_ids: {
    imdb_id: `tt${nanoid(12)}`,
  },
  poster_path: 'foo.jpg',
  overview: 'Test plot.',
  number_of_seasons: 0,
  episode_run_time: [22],
  first_air_date: '2023-05-06',
  last_air_date: null,
  status: 'Returning Series',
  seasons: [],
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

export const tmdbSeasonFactory = Factory.define<TMDbSeason>(({ sequence }) => ({
  id: generateRandomInt(1, 9999999),
  season_number: sequence,
  name: `Season ${sequence}`,
  air_date: new Date(Date.now()),
  episodes: [],
}))
