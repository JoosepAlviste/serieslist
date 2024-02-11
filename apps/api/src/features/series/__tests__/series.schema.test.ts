import type { User } from '@serieslist/core-db'
import {
  UserSeriesStatusStatus,
  episode,
  season,
  series,
  userSeriesStatus,
} from '@serieslist/core-db'
import {
  episodeFactory,
  seasonFactory,
  seriesFactory,
  userSeriesStatusFactory,
  userFactory,
  createSeriesWithEpisodesAndSeasons,
} from '@serieslist/core-db-factories'
import {
  tmdbSeasonFactory,
  tmdbEpisodeFactory,
  tmdbSeriesDetailsFactory,
  mockTMDBDetailsRequest,
  mockTMDBSearchRequest,
  mockTMDBSeasonRequest,
} from '@serieslist/feature-tmdb/test'
import { parseDate } from '@serieslist/util-dates'
import type { NotWorthIt } from '@serieslist/util-types'
import { subDays } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

import { graphql } from '#/generated/gql'
import type { SeriesUpdateStatusInput } from '#/generated/gql/graphql'
import { db } from '#/lib/db'
import { checkErrors, executeOperation, expectErrors } from '#/test/testUtils'

describe('features/series/series.schema', () => {
  describe('seriesSearch query', () => {
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

    it('searches series from the TMDB API', async () => {
      const scope = mockTMDBSearchRequest('testing', {
        results: [
          tmdbSeriesDetailsFactory.build({
            name: 'Testing Series',
            first_air_date: '2022-04-05',
            poster_path: 'foo.jpg',
          }),
        ],
      })

      const res = await executeSearch('testing')

      // The request to TMDB API was made
      scope.done()

      // And the series is returned in the response
      expect(res.data?.seriesSearch).toHaveLength(1)
      expect(res.data?.seriesSearch[0]).toEqual(
        expect.objectContaining({
          title: 'Testing Series',
          poster: 'foo.jpg',
          startYear: 2022,
        }),
      )
    })

    it('returns an empty list if the TMDB request fails', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const scope = mockTMDBSearchRequest('testing', {
        incorrect: 'response format',
      } as NotWorthIt)

      const res = await executeSearch('testing')

      // The request to TMDB API was made
      scope.done()

      expect(res.data?.seriesSearch).toHaveLength(0)
    })

    it('saves new series to the database', async () => {
      const tmdbSeries = tmdbSeriesDetailsFactory.build({
        name: 'Testing Series',
        first_air_date: '2022-04-05',
        poster_path: 'foo.jpg',
      })
      mockTMDBSearchRequest('testing', {
        results: [tmdbSeries],
      })

      await executeSearch('testing')

      const savedSeries = await db.query.series.findFirst({
        where: eq(series.tmdbId, tmdbSeries.id),
      })

      expect(savedSeries).toMatchObject({
        title: 'Testing Series',
        startYear: 2022,
        poster: 'foo.jpg',
      })
    })

    it('does not duplicate an existing series', async () => {
      const title = `testing-${nanoid()}`

      const originalSeries = await seriesFactory.create({
        title,
      })

      mockTMDBSearchRequest('testing', {
        results: [
          tmdbSeriesDetailsFactory.build({
            name: title,
            id: originalSeries.tmdbId,
          }),
        ],
      })

      await executeSearch('testing')

      const savedSeries = await db.query.series.findMany({
        where: eq(series.title, title),
      })

      expect(savedSeries).toHaveLength(1)
    })
  })

  describe('series query', () => {
    const executeSeriesQuery = (id: number | string) =>
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
              ... on Error {
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

    it('updates series details from TMDB', async () => {
      const existingSeries = await seriesFactory.create({
        plot: null,
        syncedAt: null,
      })

      const scope = mockTMDBDetailsRequest(
        existingSeries.tmdbId,
        tmdbSeriesDetailsFactory.build({
          id: existingSeries.tmdbId,
          overview: 'Updated plot',
        }),
      )

      await executeSeriesQuery(existingSeries.id)
      const resSeries = await db.query.series.findFirst({
        where: eq(series.id, existingSeries.id),
      })

      scope.isDone()

      expect(resSeries!.plot).toBe('Updated plot')
      expect(resSeries!.syncedAt).not.toBeNull()
    })

    it('does not sync details from TMDB if it has recently been synced', async () => {
      const series = await seriesFactory.create({
        syncedAt: subDays(new Date(Date.now()), 3),
      })

      const scope = mockTMDBDetailsRequest(
        series.tmdbId,
        tmdbSeriesDetailsFactory.build(),
      )

      await executeSeriesQuery(series.id)

      expect(scope.isDone()).toBeFalsy()
    })

    it('fetches seasons and episodes from TMDB API', async () => {
      const series = await seriesFactory.create({
        syncedAt: null,
      })

      mockTMDBDetailsRequest(
        series.tmdbId,
        tmdbSeriesDetailsFactory.build({
          id: series.tmdbId,
          number_of_seasons: 1,
          seasons: [
            tmdbSeasonFactory.build({
              season_number: 1,
            }),
          ],
        }),
      )

      const s1e1 = tmdbEpisodeFactory.build({
        episode_number: 1,
        name: 'Episode 1',
      })
      const s1e2 = tmdbEpisodeFactory.build({
        episode_number: 2,
        name: 'Episode 2',
      })
      const seriesSeasonScope = mockTMDBSeasonRequest(
        {
          tmdbId: series.tmdbId,
          seasonNumber: 1,
        },
        tmdbSeasonFactory.build({
          season_number: 1,
          episodes: [s1e1, s1e2],
        }),
      )

      await executeSeriesQuery(series.id)

      // The season details with episodes were fetched
      seriesSeasonScope.done()

      // The season was saved into the database
      const seasons = await db.query.season.findMany({
        where: eq(season.seriesId, series.id),
      })

      expect(seasons).toHaveLength(1)
      expect(seasons[0].number).toBe(1)

      // The episodes were saved into the database
      const episodes = await db.query.episode.findMany({
        where: eq(episode.seasonId, seasons[0].id),
      })

      expect(episodes).toHaveLength(2)
      expect(episodes[0]).toEqual(
        expect.objectContaining({
          tmdbId: s1e1.id,
          number: 1,
          title: 'Episode 1',
        }),
      )
      expect(episodes[1]).toEqual(
        expect.objectContaining({
          tmdbId: s1e2.id,
          number: 2,
          title: 'Episode 2',
        }),
      )
    })

    it('requires a numeric id', async () => {
      await seriesFactory.create({
        syncedAt: new Date(Date.now()),
      })

      const res = await executeSeriesQuery('some text')
      const error = expectErrors(res.data?.series)

      expect(error.__typename).toBe('InvalidInputError')
      expect(error.message).toContain('The ID must be a number')
    })
  })

  describe('userSeriesList query', () => {
    const executeUserSeriesListQuery = ({
      user,
      status,
    }: {
      user: User
      status?: UserSeriesStatusStatus
    }) => {
      return executeOperation({
        operation: graphql(`
          query seriesSchemaUserSeriesList($input: UserSeriesListInput!) {
            userSeriesList(input: $input) {
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
        variables: {
          input: {
            status,
          },
        },
      })
    }

    it('returns series that the user has set a status for', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [series1, series2, _series3] = await seriesFactory.createList(3)
      const user = await userFactory.create()

      await userSeriesStatusFactory.create({
        userId: user.id,
        seriesId: series1.id,
      })
      await userSeriesStatusFactory.create({
        userId: user.id,
        seriesId: series2.id,
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
      expect(resData.data[0].id).toBe(String(series1.id))
      expect(resData.data[1].id).toBe(String(series2.id))
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

    it('allows filtering series by status', async () => {
      const [series1, series2] = await seriesFactory.createList(2)
      const user = await userFactory.create()

      await userSeriesStatusFactory.create({
        userId: user.id,
        seriesId: series1.id,
        status: UserSeriesStatusStatus.InProgress,
      })
      await userSeriesStatusFactory.create({
        userId: user.id,
        seriesId: series2.id,
        status: UserSeriesStatusStatus.Completed,
      })

      const res = await executeUserSeriesListQuery({
        user,
        status: UserSeriesStatusStatus.InProgress,
      })
      const resData = checkErrors(res.data?.userSeriesList)

      expect(resData.data).toHaveLength(1)
      expect(resData.data[0].id).toBe(String(series1.id))
    })
  })

  describe('Series type', () => {
    it('allows fetching seasons for a series', async () => {
      const series = await seriesFactory.create()
      const season1 = await seasonFactory.create({
        number: 1,
        seriesId: series.id,
      })
      const season2 = await seasonFactory.create({
        number: 2,
        seriesId: series.id,
      })

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
      const season1 = await seasonFactory.create({ seriesId: series.id })
      const episode1 = await episodeFactory.create({
        number: 1,
        title: 'Episode one',
        imdbRating: '1.2',
        releasedAt: parseDate('2022-01-01'),
        seasonId: season1.id,
      })
      const episode2 = await episodeFactory.create({
        number: 2,
        title: 'Episode two',
        imdbRating: '2.3',
        releasedAt: parseDate('2022-01-02'),
        seasonId: season1.id,
      })

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
      const episodes = resSeries.seasons[0].episodes

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

      await userSeriesStatusFactory.create({
        seriesId: series.id,
        userId: user.id,
        status: UserSeriesStatusStatus.Completed,
      })

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

      expect(resSeries.status).toBe(UserSeriesStatusStatus.Completed)
    })
  })

  describe('Episode type', () => {
    it('allows querying the season for an episode', async () => {
      const {
        series,
        seasons: [{ season }],
      } = await createSeriesWithEpisodesAndSeasons([1])

      const res = await executeOperation({
        operation: graphql(`
          query episodeTypeSeason($id: ID!) {
            series(id: $id) {
              __typename
              ... on Series {
                seasons {
                  id
                  episodes {
                    id
                    season {
                      id
                    }
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

      expect(resSeries.seasons[0].episodes[0].season.id).toBe(String(season.id))
    })
  })

  describe('seriesUpdateStatus mutation', () => {
    const executeSeriesUpdateStatus = async ({
      seriesId,
      status,
      user,
    }: SeriesUpdateStatusInput & {
      user: User
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
        status: UserSeriesStatusStatus.Completed,
        user,
      })

      const seriesStatus = await db.query.userSeriesStatus.findFirst({
        where: and(
          eq(userSeriesStatus.seriesId, series.id),
          eq(userSeriesStatus.userId, user.id),
        ),
      })

      expect(seriesStatus).toBeTruthy()
      expect(seriesStatus!.status).toBe(UserSeriesStatusStatus.Completed)
    })

    it('allows updating an existing status', async () => {
      const series = await seriesFactory.create()
      const user = await userFactory.create()

      await userSeriesStatusFactory.create({
        seriesId: series.id,
        userId: user.id,
        status: UserSeriesStatusStatus.Completed,
      })

      await executeSeriesUpdateStatus({
        seriesId: series.id,
        status: UserSeriesStatusStatus.InProgress,
        user,
      })

      const seriesStatus = await db.query.userSeriesStatus.findFirst({
        where: and(
          eq(userSeriesStatus.seriesId, series.id),
          eq(userSeriesStatus.userId, user.id),
        ),
      })
      expect(seriesStatus).toBeTruthy()
      expect(seriesStatus?.status).toBe(UserSeriesStatusStatus.InProgress)
    })
  })
})
