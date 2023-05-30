import { type Selectable } from 'kysely'

import { episodeFactory } from '@/features/series'
import { userFactory } from '@/features/users'
import { type User } from '@/generated/db'
import { graphql } from '@/generated/gql'
import { type ToggleEpisodeSeenInput } from '@/generated/gql/graphql'
import { db } from '@/lib/db'
import { executeOperation } from '@/test/testUtils'

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
})
