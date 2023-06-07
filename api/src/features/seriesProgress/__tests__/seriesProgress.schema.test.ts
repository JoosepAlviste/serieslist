import { type Selectable } from 'kysely'

import { episodeFactory } from '@/features/series'
import { userFactory } from '@/features/users'
import { type User } from '@/generated/db'
import { graphql } from '@/generated/gql'
import {
  type MarkSeasonEpisodesAsSeenInput,
  type ToggleEpisodeSeenInput,
} from '@/generated/gql/graphql'
import { db } from '@/lib/db'
import {
  checkErrors,
  createSeriesWithEpisodesAndSeasons,
  executeOperation,
} from '@/test/testUtils'

import { seenEpisodeFactory } from '../seenEpisode.factory'

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

  describe('Episode type', () => {
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

      const res = await executeOperation({
        operation: graphql(`
          query seriesProgressEpisodeIsSeen($id: ID!) {
            series(id: $id) {
              __typename
              ... on Series {
                seasons {
                  episodes {
                    id
                    isSeen
                  }
                }
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

      expect(resSeries.seasons[0]?.episodes[0]?.isSeen).toBeTruthy()
    })
  })
})
