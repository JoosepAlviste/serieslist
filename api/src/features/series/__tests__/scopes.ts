import nock from 'nock'

import { config } from '@/config'
import { type OMDbSeries, type OMDbSeason } from '@/features/omdb'

export const mockOMDbDetailsRequest = (
  imdbId: string,
  response: OMDbSeries,
) => {
  return nock(`${config.omdb.url}`)
    .get('/')
    .query({
      apiKey: config.omdb.apiKey,
      i: imdbId,
      plot: 'full',
    })
    .reply(200, response)
}

export const mockOMDbSeasonRequest = (
  {
    imdbId,
    seasonNumber,
  }: {
    imdbId: string
    seasonNumber: number
  },
  response: OMDbSeason,
) =>
  nock(`${config.omdb.url}`)
    .get('/')
    .query({
      apiKey: config.omdb.apiKey,
      i: imdbId,
      Season: seasonNumber,
    })
    .reply(200, response)
