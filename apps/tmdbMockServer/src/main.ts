/**
 * This file includes a mock server that behaves similarly to the TMDB API, but
 * is used in our E2E tests.
 *
 * Basically, it allows us to return the exact data that we want to check in the
 * E2E tests without worrying about the TMDB API affecting us in any way (making
 * the tests slow, flaky, or give invalid data).
 *
 * Feel free to add more series to be returned here.
 */

import type {
  TMDBSeries,
  TMDBSeason,
  TMDBEpisode,
  TMDBSearchResponse,
} from '@serieslist/feature-tmdb'
import {
  tmdbEpisodeFactory,
  tmdbSeasonFactory,
  tmdbSeriesDetailsFactory,
} from '@serieslist/feature-tmdb/test'
import fastify from 'fastify'
import omit from 'just-omit'

import { createArrayOfLength } from './lib/createArrayOfLength'

const app = fastify({
  logger: true,
})

type TMDBSeriesWithFullInfo = Omit<TMDBSeries, 'seasons'> & {
  seasons: TMDBSeason[]
}

export const createSeriesWithEpisodesAndSeasons = (
  series: TMDBSeries,
  seasonEpisodesCount: number[],
): TMDBSeriesWithFullInfo => ({
  ...series,
  number_of_seasons: seasonEpisodesCount.length,
  seasons: seasonEpisodesCount.map((episodesCount, seasonIndex) =>
    tmdbSeasonFactory.build({
      season_number: seasonIndex + 1,
      episodes: createArrayOfLength(episodesCount).map((_, index) =>
        tmdbEpisodeFactory.build({
          episode_number: index + 1,
        }),
      ),
    }),
  ),
})

const futurama = createSeriesWithEpisodesAndSeasons(
  tmdbSeriesDetailsFactory.build({
    id: 123,
    name: 'Futurama',
    poster_path: '/7RRHbCUtAsVmKI6FEMzZB6Re88P.jpg',
    overview:
      'The adventures of a late-20th-century New York City pizza delivery boy, Philip J. Fry, who, after being unwittingly cryogenically frozen for one thousand years, finds employment at Planet Express, an interplanetary delivery company in the retro-futuristic 31st century.',

    episode_run_time: [22],
    first_air_date: new Date('2013-09-04'),
    status: 'Returning Series',
    external_ids: {
      imdb_id: 'tt0149460',
    },
  }),
  [8, 8, 8, 8],
)

/**
 * Keep track of all the created generated here, in memory.
 */
const db = {
  series: {} as Record<string, TMDBSeriesWithFullInfo>,
  seasons: {} as Record<string, TMDBSeason>,
  episodes: {} as Record<string, TMDBEpisode>,
}

const series = [futurama]
const seasons = [...futurama.seasons]
const episodes = [...futurama.seasons.map((season) => season.episodes).flat()]
series.forEach((serie) => {
  db.series[serie.id] = serie
})
seasons.forEach((season) => {
  db.seasons[season.id] = season
})
episodes.forEach((episode) => {
  db.episodes[episode.id] = episode
})

/**
 * This health-check endpoint is used by Playwright to check if the API is ready.
 */
app.get('/', (_res, reply) => {
  return reply.status(200).send('OK')
})

/* eslint-disable @typescript-eslint/require-await */

app.get(
  '/3/search/tv',
  async (): Promise<TMDBSearchResponse> => ({
    page: 1,
    total_pages: 1,
    total_results: 1,
    results: Object.values(db.series).map((serie) => omit(serie, ['seasons'])),
  }),
)

app.get<{
  Params: {
    seriesId: string
  }
}>(
  '/3/tv/:seriesId',
  async (request): Promise<TMDBSeries> => db.series[request.params.seriesId],
)

app.get<{
  Params: {
    seriesId: string
    seasonNumber: string
  }
}>(
  '/3/tv/:seriesId/season/:seasonNumber',
  async (request): Promise<TMDBSeason> => {
    const { seriesId, seasonNumber } = request.params
    const season = db.series[seriesId].seasons.find(
      (season) => season.season_number === parseInt(seasonNumber),
    )

    return season!
  },
)

await app.listen({ port: 4002 })
