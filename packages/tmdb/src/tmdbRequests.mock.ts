import nock from 'nock'

import { config } from './config'
import {
  type TMDBSearchResponse,
  type TMDBSeriesResponse,
  type TMDBSeasonResponse,
} from './tmdb.types'

export const mockTMDBSearchRequest = (
  keyword: string,
  response: Pick<TMDBSearchResponse, 'results'>,
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

export const mockTMDBDetailsRequest = (
  tmdbId: number,
  response: TMDBSeriesResponse,
) => {
  return nock(config.tmdb.url)
    .get(`/3/tv/${tmdbId}`)
    .query({
      append_to_response: 'external_ids',
    })
    .reply(200, response)
}

export const mockTMDBSeasonRequest = (
  {
    tmdbId,
    seasonNumber,
  }: {
    tmdbId: number
    seasonNumber: number
  },
  response: TMDBSeasonResponse,
) =>
  nock(config.tmdb.url)
    .get(`/3/tv/${tmdbId}/season/${seasonNumber}`)
    .reply(200, response)
