import { type Selectable } from 'kysely'

import { episodeFactory } from '@/features/series'
import { userFactory } from '@/features/users'
import { type User } from '@/generated/db'
import { graphql } from '@/generated/gql'
import {
  type MarkSeriesEpisodesAsSeenInput,
  type MarkSeasonEpisodesAsSeenInput,
  type ToggleEpisodeSeenInput,
} from '@/generated/gql/graphql'
import { db } from '@/lib/db'
import {
  checkErrors,
  createSeenEpisodesForUser,
  createSeriesWithEpisodesAndSeasons,
  executeOperation,
} from '@/test/testUtils'

import { seenEpisodeFactory } from '../seenEpisode.factory'
import { seriesProgressFactory } from '../seriesProgress.factory'

describe('features/seriesProgress/seriesProgress.schema', () => {
  describe('toggleEpisodeSeen mutation', () => {
    const executeMutation = async ({
      episodeId,
      user,
    }: ToggleEpisodeSeenInput & {
      user: Selectable<User>
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

      const seenEpisode = await db
        .selectFrom('seenEpisode')
        .where('episodeId', '=', episode.id)
        .where('userId', '=', user.id)
        .executeTakeFirst()
      expect(seenEpisode).toBeTruthy()
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

      const seenEpisode = await db
        .selectFrom('seenEpisode')
        .where('episodeId', '=', episode.id)
        .where('userId', '=', user.id)
        .executeTakeFirst()
      expect(seenEpisode).toBeFalsy()
    })
  })

  describe('markSeasonEpisodesAsSeen mutation', () => {
    const executeMutation = async ({
      seasonId,
      user,
    }: MarkSeasonEpisodesAsSeenInput & {
      user: Selectable<User>
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
      const seenEpisode = await db
        .selectFrom('seenEpisode')
        .where('episodeId', 'in', [episode1.id, episode2.id])
        .where('userId', '=', user.id)
        .execute()
      expect(seenEpisode).toHaveLength(2)
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

      const seenEpisode = await db
        .selectFrom('seenEpisode')
        .where('episodeId', 'in', [episode1.id, episode2.id])
        .where('userId', '=', user.id)
        .execute()
      expect(seenEpisode).toHaveLength(2)
    })
  })

  describe('markSeriesEpisodesAsSeen mutation', () => {
    const executeMutation = async ({
      seriesId,
      user,
    }: MarkSeriesEpisodesAsSeenInput & {
      user: Selectable<User>
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
        seriesId: series.id,
        user,
      })

      const seenEpisodes = await db
        .selectFrom('seenEpisode')
        .where('episodeId', 'in', [s1e1.id, s2e1.id])
        .execute()
      expect(seenEpisodes).toHaveLength(2)
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
        seriesId: series.id,
        user,
      })

      const progress = await db
        .selectFrom('seriesProgress')
        .selectAll()
        .where('seriesId', '=', series.id)
        .where('userId', '=', user.id)
        .executeTakeFirstOrThrow()
      expect(progress.latestSeenEpisodeId).toBe(s2e1.id)
      expect(progress.nextEpisodeId).toBe(null)
    })
  })

  describe('Episode type', () => {
    const queryEpisode = (seriesId: number, user: Selectable<User>) => {
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

      const res = await queryEpisode(series.id, user)
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

      const res = await queryEpisode(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.latestSeenEpisode?.id).toBe(String(s1e1.id))
    })

    it('returns null if there is no latest seen episode', async () => {
      const { series } = await createSeriesWithEpisodesAndSeasons([1])

      const user = await userFactory.create()

      const res = await queryEpisode(series.id, user)
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

      const res = await queryEpisode(series.id, user)
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

      const res = await queryEpisode(series.id, user)
      const resSeries = checkErrors(res.data?.series)

      expect(resSeries.nextEpisode).toBe(null)
    })
  })
})
