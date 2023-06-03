import { parseISO, subDays } from 'date-fns'
import { type Selectable } from 'kysely'
import { nanoid } from 'nanoid'
import nock, { type Body } from 'nock'

import { config } from '@/config'
import { omdbSeriesDetailsFactory, omdbEpisodeFactory } from '@/features/omdb'
import { userFactory } from '@/features/users'
import { type User } from '@/generated/db'
import { graphql } from '@/generated/gql'
import { type SeriesUpdateStatusInput } from '@/generated/gql/graphql'
import { db } from '@/lib/db'
import { checkErrors, executeOperation } from '@/test/testUtils'

import { UserSeriesStatus } from '../constants'
import { episodeFactory } from '../episode.factory'
import { seasonFactory } from '../season.factory'
import { seriesFactory } from '../series.factory'
import { userSeriesStatusFactory } from '../userSeriesStatus.factory'

import { mockOMDbDetailsRequest, mockOMDbSeasonRequest } from './scopes'

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
          omdbSeriesDetailsFactory.build({
            Title: 'Testing Series',
            Year: '2022–2023',
            imdbID: 'tt1337',
            Poster: 'foo.jpg',
          }),
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
          omdbSeriesDetailsFactory.build({
            Title: 'Testing Series',
            Year: '2022–2023',
            imdbID: 'tt1337',
            Poster: 'foo.jpg',
          }),
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
          omdbSeriesDetailsFactory.build({
            Title: title,
            Year: '2022–2023',
            imdbID: imdbId,
            Poster: 'foo.jpg',
          }),
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
  })

  describe('series query', () => {
    const executeSeriesQuery = (id: number) =>
      executeOperation({
        operation: graphql(`
          query series($id: ID!) {
            series(id: $id) {
              __typename
              ... on Series {
                id
                title
                seasons {
                  id
                  episodes {
                    id
                  }
                }
              }
              ... on NotFoundError {
                message
              }
            }
          }
        `),
        variables: {
          id: String(id),
        },
      })

    it('allows fetching series details by its id', async () => {
      const series = await seriesFactory.create({
        title: 'Test Series',
        syncedAt: new Date(Date.now()),
      })

      const res = await executeSeriesQuery(series.id)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.id).toBe(String(series.id))
      expect(resSeries.title).toBe('Test Series')
    })

    it('updates series details from OMDb', async () => {
      const series = await seriesFactory.create({
        plot: null,
        syncedAt: null,
      })

      const scope = mockOMDbDetailsRequest(
        series.imdbId,
        omdbSeriesDetailsFactory.build({
          imdbID: series.imdbId,
          Plot: 'Updated plot',
          totalSeasons: '0',
        }),
      )

      await executeSeriesQuery(series.id)
      const resSeries = await db
        .selectFrom('series')
        .where('id', '=', series.id)
        .selectAll()
        .executeTakeFirstOrThrow()

      scope.isDone()

      expect(resSeries.plot).toBe('Updated plot')
      expect(resSeries.syncedAt).not.toBeNull()
    })

    it('does not sync details from OMDb if it has recently been synced', async () => {
      const series = await seriesFactory.create({
        syncedAt: subDays(new Date(Date.now()), 3),
      })

      const scope = mockOMDbDetailsRequest(
        series.imdbId,
        omdbSeriesDetailsFactory.build(),
      )

      await executeSeriesQuery(series.id)

      expect(scope.isDone()).toBeFalsy()
    })

    it('fetches seasons and episodes from OMDb API', async () => {
      const series = await seriesFactory.create({
        imdbId: `tt${nanoid(8)}`,
        syncedAt: null,
      })

      mockOMDbDetailsRequest(
        series.imdbId,
        omdbSeriesDetailsFactory.build({
          imdbID: series.imdbId,
          Plot: 'Updated plot',
          totalSeasons: '1',
        }),
      )

      const seriesSeasonScope = mockOMDbSeasonRequest(
        {
          imdbId: series.imdbId,
          seasonNumber: 1,
        },
        {
          Season: '1',
          Episodes: [
            omdbEpisodeFactory.build({
              Episode: '1',
              Title: 'Episode 1',
              imdbID: `${series.imdbId}s1e1`,
              imdbRating: '7.2',
            }),
            omdbEpisodeFactory.build({
              Episode: '2',
              Title: 'Episode 2',
              imdbID: `${series.imdbId}s1e2`,
              imdbRating: '7.3',
            }),
          ],
        },
      )

      await executeSeriesQuery(series.id)

      // The season details with episodes were fetched
      seriesSeasonScope.done()

      // The season was saved into the database
      const seasons = await db
        .selectFrom('season')
        .selectAll()
        .where('seriesId', '=', series.id)
        .execute()

      expect(seasons).toHaveLength(1)
      expect(seasons[0]!.number).toBe(1)

      // The episodes were saved into the database
      const episodes = await db
        .selectFrom('episode')
        .selectAll()
        .where('seasonId', '=', seasons[0]!.id)
        .execute()

      expect(episodes).toHaveLength(2)
      expect(episodes[0]).toEqual(
        expect.objectContaining({
          number: 1,
          title: 'Episode 1',
          imdbId: `${series.imdbId}s1e1`,
          imdbRating: '7.2',
        }),
      )
      expect(episodes[1]).toEqual(
        expect.objectContaining({
          number: 2,
          title: 'Episode 2',
          imdbId: `${series.imdbId}s1e2`,
          imdbRating: '7.3',
        }),
      )
    })
  })

  describe('userSeriesList query', () => {
    const executeUserSeriesListQuery = ({
      user,
    }: {
      user: Selectable<User>
    }) => {
      return executeOperation({
        operation: graphql(`
          query seriesSchemaUserSeriesList {
            userSeriesList {
              __typename
              ... on Error {
                message
              }
              ... on QueryUserSeriesListSuccess {
                data {
                  id
                }
              }
            }
          }
        `),
        user,
      })
    }

    it('returns series that the user has set a status for', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [series1, series2, _series3] = await seriesFactory.createList(3)
      const user = await userFactory.create()

      await userSeriesStatusFactory.create({
        userId: user.id,
        seriesId: series1!.id,
      })
      await userSeriesStatusFactory.create({
        userId: user.id,
        seriesId: series2!.id,
      })
      // The third series does not have a status set

      const res = await executeUserSeriesListQuery({
        user,
      })
      const resData = checkErrors(res.data?.userSeriesList)

      // There is an extra object that contains the list of series because the
      // errors plugin's `directResult` only removes the result object type
      // from non-list fields.
      expect(resData.data).toHaveLength(2)
      expect(resData.data[0]!.id).toBe(String(series1!.id))
      expect(resData.data[1]!.id).toBe(String(series2!.id))
    })

    it('does not return series for other users', async () => {
      const series = await seriesFactory.create()
      const user = await userFactory.create()
      const anotherUser = await userFactory.create()

      await userSeriesStatusFactory.create({
        userId: anotherUser.id,
        seriesId: series.id,
      })

      const res = await executeUserSeriesListQuery({
        user,
      })
      const resData = checkErrors(res.data?.userSeriesList)

      expect(resData.data).toHaveLength(0)
    })
  })

  describe('Series type', () => {
    it('allows fetching seasons for a series', async () => {
      const series = await seriesFactory.create()
      const season1 = await seasonFactory.create(
        { number: 1 },
        { associations: { seriesId: series.id } },
      )
      const season2 = await seasonFactory.create(
        { number: 2 },
        { associations: { seriesId: series.id } },
      )

      const res = await executeOperation({
        operation: graphql(`
          query seriesTypeSeries($id: ID!) {
            series(id: $id) {
              __typename
              ... on Series {
                seasons {
                  id
                  number
                }
              }
            }
          }
        `),
        variables: {
          id: String(series.id),
        },
      })
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.seasons).toHaveLength(2)
      expect(resSeries.seasons[0]).toEqual({
        id: String(season1.id),
        number: 1,
      })
      expect(resSeries.seasons[1]).toEqual({
        id: String(season2.id),
        number: 2,
      })
    })

    it('allows fetching episodes for a series', async () => {
      const series = await seriesFactory.create()
      const season1 = await seasonFactory.create(
        {},
        { associations: { seriesId: series.id } },
      )
      const episode1 = await episodeFactory.create(
        {
          number: 1,
          title: 'Episode one',
          imdbRating: '1.2',
          releasedAt: parseISO('2022-01-01'),
        },
        { associations: { seasonId: season1.id } },
      )
      const episode2 = await episodeFactory.create(
        {
          number: 2,
          title: 'Episode two',
          imdbRating: '2.3',
          releasedAt: parseISO('2022-01-02'),
        },
        { associations: { seasonId: season1.id } },
      )

      const res = await executeOperation({
        operation: graphql(`
          query seriesTypeSeriesEpisodes($id: ID!) {
            series(id: $id) {
              __typename
              ... on Series {
                seasons {
                  episodes {
                    id
                    imdbId
                    number
                    title
                    imdbRating
                    releasedAt
                  }
                }
              }
            }
          }
        `),
        variables: {
          id: String(series.id),
        },
      })
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.seasons).toHaveLength(1)
      const episodes = resSeries.seasons[0]!.episodes

      expect(episodes).toHaveLength(2)
      expect(episodes[0]).toEqual({
        id: String(episode1.id),
        imdbId: episode1.imdbId,
        number: 1,
        title: 'Episode one',
        imdbRating: 1.2,
        releasedAt: '2022-01-01',
      })
      expect(episodes[1]).toEqual({
        id: String(episode2.id),
        imdbId: episode2.imdbId,
        number: 2,
        title: 'Episode two',
        imdbRating: 2.3,
        releasedAt: '2022-01-02',
      })
    })

    it('allows fetching series status', async () => {
      const user = await userFactory.create()
      const series = await seriesFactory.create()

      await db
        .insertInto('userSeriesStatus')
        .values({
          seriesId: series.id,
          userId: user.id,
          status: UserSeriesStatus.Completed,
        })
        .execute()

      const res = await executeOperation({
        operation: graphql(`
          query seriesTypeSeriesStatus($id: ID!) {
            series(id: $id) {
              __typename
              ... on Series {
                status
              }
            }
          }
        `),
        variables: {
          id: String(series.id),
        },
        user,
      })
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.status).toBe(UserSeriesStatus.Completed)
    })
  })

  describe('seriesUpdateStatus mutation', () => {
    const executeSeriesUpdateStatus = async ({
      seriesId,
      status,
      user,
    }: SeriesUpdateStatusInput & {
      user: Selectable<User>
    }) => {
      return await executeOperation({
        operation: graphql(`
          mutation seriesUpdateStatus($input: SeriesUpdateStatusInput!) {
            seriesUpdateStatus(input: $input) {
              __typename
            }
          }
        `),
        variables: {
          input: {
            seriesId,
            status,
          },
        },
        user,
      })
    }

    it("allows updating the user's status of the series", async () => {
      const series = await seriesFactory.create()
      const user = await userFactory.create()

      await executeSeriesUpdateStatus({
        seriesId: series.id,
        status: UserSeriesStatus.Completed,
        user,
      })

      const seriesStatus = await db
        .selectFrom('userSeriesStatus')
        .where('seriesId', '=', series.id)
        .where('userId', '=', user.id)
        .selectAll()
        .executeTakeFirst()
      expect(seriesStatus).toBeTruthy()
      expect(seriesStatus?.status).toBe(UserSeriesStatus.Completed)
    })

    it('allows updating an existing status', async () => {
      const series = await seriesFactory.create()
      const user = await userFactory.create()

      await db
        .insertInto('userSeriesStatus')
        .values({
          seriesId: series.id,
          userId: user.id,
          status: UserSeriesStatus.Completed,
        })
        .execute()

      await executeSeriesUpdateStatus({
        seriesId: series.id,
        status: UserSeriesStatus.InProgress,
        user,
      })

      const seriesStatus = await db
        .selectFrom('userSeriesStatus')
        .where('seriesId', '=', series.id)
        .where('userId', '=', user.id)
        .selectAll()
        .executeTakeFirst()
      expect(seriesStatus).toBeTruthy()
      expect(seriesStatus?.status).toBe(UserSeriesStatus.InProgress)
    })
  })
})
