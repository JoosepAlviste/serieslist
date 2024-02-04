import { seenEpisode, seriesProgress, type User } from '@serieslist/core-db'
import { UserSeriesStatusStatus } from '@serieslist/core-db'
import {
  seenEpisodeFactory,
  seriesProgressFactory,
  episodeFactory,
  userSeriesStatusFactory,
  userFactory,
} from '@serieslist/core-db-factories'
import { addDays } from 'date-fns'
import { and, eq, inArray } from 'drizzle-orm'

import { graphql } from '#/generated/gql'
import type {
  MarkSeriesEpisodesAsSeenInput,
  MarkSeasonEpisodesAsSeenInput,
  ToggleEpisodeSeenInput,
} from '#/generated/gql/graphql'
import { db } from '#/lib/db'
import {
  checkErrors,
  createSeenEpisodesForUser,
  createSeriesWithEpisodesAndSeasons,
  executeOperation,
} from '#/test/testUtils'

describe('features/seriesProgress/seriesProgress.schema', () => {
  describe('toggleEpisodeSeen mutation', () => {
    const executeMutation = async ({
      episodeId,
      user,
    }: ToggleEpisodeSeenInput & {
      user: User
    }) =>
      await executeOperation({
        operation: graphql(`
          mutation toggleEpisodeSeen($input: ToggleEpisodeSeenInput!) {
            toggleEpisodeSeen(input: $input) {
              __typename
              ... on Error {
                message
              }
              ... on Episode {
                id
              }
            }
          }
        `),
        variables: { input: { episodeId } },
        user,
      })

    it('allows marking an episode as seen', async () => {
      const episode = await episodeFactory.create()
      const user = await userFactory.create()

      await executeMutation({
        episodeId: episode.id,
        user,
      })

      const newSeenEpisode = await db.query.seenEpisode.findFirst({
        where: and(
          eq(seenEpisode.episodeId, episode.id),
          eq(seenEpisode.userId, user.id),
        ),
      })
      expect(newSeenEpisode).toBeTruthy()
    })

    it('allows un-marking an episode as seen', async () => {
      const episode = await episodeFactory.create()
      const user = await userFactory.create()

      await seenEpisodeFactory.create({
        episodeId: episode.id,
        userId: user.id,
      })

      await executeMutation({
        episodeId: episode.id,
        user,
      })

      const newSeenEpisode = await db.query.seenEpisode.findFirst({
        where: and(
          eq(seenEpisode.episodeId, episode.id),
          eq(seenEpisode.userId, user.id),
        ),
      })
      expect(newSeenEpisode).toBeFalsy()
    })
  })

  describe('markSeasonEpisodesAsSeen mutation', () => {
    const executeMutation = async ({
      seasonId,
      user,
    }: MarkSeasonEpisodesAsSeenInput & {
      user: User
    }) =>
      await executeOperation({
        operation: graphql(`
          mutation markSeasonEpisodesAsSeen(
            $input: MarkSeasonEpisodesAsSeenInput!
          ) {
            markSeasonEpisodesAsSeen(input: $input) {
              __typename
              ... on Season {
                episodes {
                  id
                  isSeen
                }
              }
            }
          }
        `),
        variables: { input: { seasonId } },
        user,
      })

    it('allows marking all episodes in a season as seen', async () => {
      const {
        seasons: [
          {
            season,
            episodes: [episode1, episode2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])
      const user = await userFactory.create()

      const res = await executeMutation({
        seasonId: season.id,
        user,
      })
      const resSeason = checkErrors(res.data?.markSeasonEpisodesAsSeen)

      // Both returned episodes are seen
      expect(resSeason.episodes).toEqual([
        expect.objectContaining({
          isSeen: true,
        }),
        expect.objectContaining({
          isSeen: true,
        }),
      ])

      // And the episodes are updated in the db as well
      const newSeenEpisodes = await db.query.seenEpisode.findMany({
        where: and(
          inArray(seenEpisode.episodeId, [episode1.id, episode2.id]),
          eq(seenEpisode.userId, user.id),
        ),
      })
      expect(newSeenEpisodes).toHaveLength(2)
    })

    it('does not fail if one of the episodes is already marked as seen', async () => {
      const {
        seasons: [
          {
            season,
            episodes: [episode1, episode2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])
      const user = await userFactory.create()

      await seenEpisodeFactory.create({
        episodeId: episode1.id,
        userId: user.id,
      })

      await executeMutation({
        seasonId: season.id,
        user,
      })

      const newSeenEpisodes = await db.query.seenEpisode.findMany({
        where: and(
          inArray(seenEpisode.episodeId, [episode1.id, episode2.id]),
          eq(seenEpisode.userId, user.id),
        ),
      })
      expect(newSeenEpisodes).toHaveLength(2)
    })
  })

  describe('markSeriesEpisodesAsSeen mutation', () => {
    const executeMutation = async ({
      seriesId,
      user,
    }: MarkSeriesEpisodesAsSeenInput & {
      user: User
    }) =>
      await executeOperation({
        operation: graphql(`
          mutation markSeriesEpisodesAsSeen(
            $input: MarkSeriesEpisodesAsSeenInput!
          ) {
            markSeriesEpisodesAsSeen(input: $input) {
              __typename
              ... on Series {
                id
              }
            }
          }
        `),
        variables: { input: { seriesId } },
        user,
      })

    it('allows marking all episodes in a series as seen', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1],
          },
          {
            episodes: [s2e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1, 1])
      const user = await userFactory.create()

      await executeMutation({
        seriesId: String(series.id),
        user,
      })

      const newSeenEpisodes = await db.query.seenEpisode.findMany({
        where: inArray(seenEpisode.episodeId, [s1e1.id, s2e1.id]),
      })
      expect(newSeenEpisodes).toHaveLength(2)
    })

    it('advances series progress to the last episode', async () => {
      const {
        series,
        seasons: [
          ,
          {
            episodes: [s2e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1, 1])
      const user = await userFactory.create()

      await executeMutation({
        seriesId: String(series.id),
        user,
      })

      const progress = await db.query.seriesProgress.findFirst({
        where: and(
          eq(seriesProgress.seriesId, series.id),
          eq(seriesProgress.userId, user.id),
        ),
      })
      expect(progress!.latestSeenEpisodeId).toBe(s2e1.id)
      expect(progress!.nextEpisodeId).toBe(null)
    })
  })

  describe('Episode type', () => {
    const querySeries = (seriesId: number, user: User) => {
      return executeOperation({
        operation: graphql(`
          query seriesProgressEpisode($id: ID!) {
            series(id: $id) {
              __typename
              ... on Series {
                seasons {
                  episodes {
                    id
                    isSeen
                  }
                }
                latestSeenEpisode {
                  id
                }
                nextEpisode {
                  id
                }
              }
            }
          }
        `),
        variables: {
          id: String(seriesId),
        },
        user,
      })
    }

    const querySeriesList = (user: User) => {
      return executeOperation({
        operation: graphql(`
          query seriesProgressEpisodeList($input: UserSeriesListInput!) {
            userSeriesList(input: $input) {
              __typename
              ... on QueryUserSeriesListSuccess {
                data {
                  id
                  latestSeenEpisode {
                    id
                  }
                  nextEpisode {
                    id
                  }
                }
              }
            }
          }
        `),
        variables: {
          input: {
            status: null,
          },
        },
        user,
      })
    }

    it('allows querying if the episode is seen', async () => {
      const user = await userFactory.create()

      const {
        series,
        seasons: [
          {
            episodes: [episode],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])

      await seenEpisodeFactory.create({
        userId: user.id,
        episodeId: episode.id,
      })

      const res = await querySeries(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.seasons[0]?.episodes[0]?.isSeen).toBeTruthy()
    })

    it('allows querying the latest seen episode of a series', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1, s1e2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])

      const { user } = await createSeenEpisodesForUser([s1e1.id])
      await seriesProgressFactory.create({
        userId: user.id,
        seriesId: series.id,
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: s1e2.id,
      })

      const res = await querySeries(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.latestSeenEpisode?.id).toBe(String(s1e1.id))
    })

    it('returns null if there is no latest seen episode', async () => {
      const { series } = await createSeriesWithEpisodesAndSeasons([1])

      const user = await userFactory.create()

      const res = await querySeries(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.latestSeenEpisode).toBe(null)
    })

    it('allows querying the next episode of a series', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1, s1e2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])

      const { user } = await createSeenEpisodesForUser([s1e1.id])
      await seriesProgressFactory.create({
        userId: user.id,
        seriesId: series.id,
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: s1e2.id,
      })

      const res = await querySeries(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.nextEpisode?.id).toBe(String(s1e2.id))
    })

    it('returns null if there is no next episode', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])

      const { user } = await createSeenEpisodesForUser([s1e1.id])
      await seriesProgressFactory.create({
        userId: user.id,
        seriesId: series.id,
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: null,
      })

      const res = await querySeries(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.nextEpisode).toBe(null)
    })

    it('does not return next episode if it will be released in the future', async () => {
      const {
        series,
        seasons: [
          {
            season,
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])
      const s1e2 = await episodeFactory.create({
        seasonId: season.id,
        releasedAt: addDays(new Date(), 1),
      })

      const { user } = await createSeenEpisodesForUser([s1e1.id])
      await seriesProgressFactory.create({
        userId: user.id,
        seriesId: series.id,
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: s1e2.id,
      })

      const res = await querySeries(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.nextEpisode).toBe(null)
    })

    it('returns the first episode as the next one if there is no progress', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])

      const user = await userFactory.create()

      const res = await querySeries(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.nextEpisode!.id).toBe(String(s1e1.id))
    })

    it('returns the first episode as the next one for multiple series', async () => {
      const {
        series: series1,
        seasons: [
          {
            episodes: [series1S1E1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])
      const {
        series: series2,
        seasons: [
          {
            episodes: [series2S1E1, series2S1E2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])

      const { user } = await createSeenEpisodesForUser([series2S1E1.id])
      await seriesProgressFactory.create({
        userId: user.id,
        seriesId: series2.id,
        latestSeenEpisodeId: series2S1E1.id,
        nextEpisodeId: series2S1E2.id,
      })

      await userSeriesStatusFactory.create({
        userId: user.id,
        status: UserSeriesStatusStatus.InProgress,
        seriesId: series1.id,
      })
      await userSeriesStatusFactory.create({
        userId: user.id,
        status: UserSeriesStatusStatus.InProgress,
        seriesId: series2.id,
      })

      const res = await querySeriesList(user)
      const { data: returnedSeries } = checkErrors(res.data?.userSeriesList)

      const nextEpisodes = returnedSeries.map(
        (series) => series.nextEpisode?.id,
      )

      expect(nextEpisodes).toContain(String(series1S1E1.id))
      expect(nextEpisodes).toContain(String(series2S1E2.id))
    })
  })
})
