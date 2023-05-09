import nock, { type Body } from 'nock'
import { describe, expect, it } from 'vitest'

import { config } from '@/config'
import { graphql } from '@/generated/gql'
import { executeOperation } from '@/test/testUtils'

describe('features/series/series.schema', () => {
  describe('seriesSearch query', () => {
    const mockOMDbSearchRequest = (keyword: string, response: Body) => {
      return nock(`${config.omdb.url}`)
        .get('/')
        .query({
          apiKey: config.omdb.apiKey,
          type: 'series',
          s: keyword,
        })
        .reply(200, response)
    }

    const executeSearch = (keyword = 'testing') =>
      executeOperation({
        operation: graphql(`
          query seriesSearch($input: SeriesSearchInput!) {
            seriesSearch(input: $input) {
              id
              title
              imdbId
            }
          }
        `),
        variables: {
          input: {
            keyword,
          },
        },
      })

    it('searches series from the OMDb API', async () => {
      const scope = mockOMDbSearchRequest('testing*', {
        Search: [
          {
            Title: 'Testing Series',
            Year: '2022-2023',
            imdbID: 'tt1337',
            Poster: 'foo.jpg',
          },
        ],
      })

      const res = await executeSearch('testing')

      // The request to OMDb API was made
      scope.done()

      // And the series is returned in the response
      expect(res.data?.seriesSearch).toHaveLength(1)
      expect(res.data?.seriesSearch[0]).toEqual(
        expect.objectContaining({
          title: 'Testing Series',
          imdbId: 'tt1337',
        }),
      )
    })

    it('returns an empty list if the OMDb request fails', async () => {
      const scope = mockOMDbSearchRequest('testing*', {
        incorrect: 'response format',
      })

      const res = await executeSearch('testing')

      // The request to OMDb API was made
      scope.done()

      expect(res.data?.seriesSearch).toHaveLength(0)
    })
  })
})
