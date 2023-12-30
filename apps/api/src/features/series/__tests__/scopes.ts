import nock from 'nock'

import { config } from '#/config'
import {
  type TMDbSearchResponse,
  type TMDbSeriesResponse,
  type TMDbSeasonResponse,
} from '#/features/tmdb'

export const mockTMDbSearchRequest = (
  keyword: string,
  response: Pick<TMDbSearchResponse, 'results'>,
) => {
  return nock(config.tmdb.url)
    .get('/3/search/tv')
    .query({
      query: keyword,
    })
    .reply(200, {
      page: 1,
      total_pages: 1,
      // It could be undefined if an incorrect format is passed in on purpose in
      // tests
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      total_results: response.results?.length,
      ...response,
    })
}

export const mockTMDbDetailsRequest = (
  tmdbId: number,
  response: TMDbSeriesResponse,
) => {
  return nock(config.tmdb.url)
    .get(`/3/tv/${tmdbId}`)
    .query({
      append_to_response: 'external_ids',
    })
    .reply(200, response)
}

export const mockTMDbSeasonRequest = (
  {
    tmdbId,
    seasonNumber,
  }: {
    tmdbId: number
    seasonNumber: number
  },
  response: TMDbSeasonResponse,
) =>
  nock(config.tmdb.url)
    .get(`/3/tv/${tmdbId}/season/${seasonNumber}`)
    .reply(200, response)
