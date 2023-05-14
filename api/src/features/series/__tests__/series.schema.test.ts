import { nanoid } from 'nanoid'
import nock, { type Body } from 'nock'
import { describe, expect, it } from 'vitest'

import { config } from '@/config'
import { graphql } from '@/generated/gql'
import { db } from '@/lib/db'
import { executeOperation } from '@/test/testUtils'

import { seriesFactory } from '../series.factory'

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
              poster
              startYear
              endYear
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
            Year: '2022–2023',
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
          poster: 'foo.jpg',
          startYear: 2022,
          endYear: 2023,
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

    it('saves new series to the database', async () => {
      mockOMDbSearchRequest('testing*', {
        Search: [
          {
            Title: 'Testing Series',
            Year: '2022–2023',
            imdbID: 'tt1337',
            Poster: 'foo.jpg',
          },
        ],
      })

      await executeSearch('testing')

      const savedSeries = await db
        .selectFrom('series')
        .select(['title', 'poster', 'startYear', 'endYear'])
        .where('imdbId', '=', 'tt1337')
        .executeTakeFirst()

      expect(savedSeries).toEqual({
        title: 'Testing Series',
        startYear: 2022,
        endYear: 2023,
        poster: 'foo.jpg',
      })
    })

    it('does not duplicate an existing series', async () => {
      const imdbId = `tt${nanoid(12)}`
      const title = `testing-${nanoid()}`

      await seriesFactory.create({
        imdbId,
        title,
      })

      mockOMDbSearchRequest('testing*', {
        Search: [
          {
            Title: title,
            Year: '2022–2023',
            imdbID: imdbId,
            Poster: 'foo.jpg',
          },
        ],
      })

      await executeSearch('testing')

      const savedSeries = await db
        .selectFrom('series')
        .select(['id'])
        .where('title', '=', title)
        .execute()

      expect(savedSeries).toHaveLength(1)
    })

    it('does not store end year if not given', async () => {
      const imdbId = `tt${nanoid(12)}`

      mockOMDbSearchRequest('testing*', {
        Search: [
          {
            Title: 'Testing Series',
            Year: '2022–',
            imdbID: imdbId,
            Poster: 'foo.jpg',
          },
        ],
      })

      await executeSearch('testing')

      const savedSeries = await db
        .selectFrom('series')
        .select(['startYear', 'endYear'])
        .where('imdbId', '=', imdbId)
        .executeTakeFirst()

      expect(savedSeries!.startYear).toEqual(2022)
      expect(savedSeries!.endYear).toEqual(null)
    })

    it('stores the same start and end year if a single year is given', async () => {
      const imdbId = `tt${nanoid(12)}`

      mockOMDbSearchRequest('testing*', {
        Search: [
          {
            Title: 'Testing Series',
            Year: '2022',
            imdbID: imdbId,
            Poster: 'foo.jpg',
          },
        ],
      })

      await executeSearch('testing')

      const savedSeries = await db
        .selectFrom('series')
        .select(['startYear', 'endYear'])
        .where('imdbId', '=', imdbId)
        .executeTakeFirst()

      expect(savedSeries!.startYear).toEqual(2022)
      expect(savedSeries!.endYear).toEqual(2022)
    })
  })
})
