import { seenEpisode } from '@serieslist/core-db'
import type { User, SeenEpisode } from '@serieslist/core-db'
import { Factory } from 'fishery'

import { episodeFactory } from './episode.factory'
import { db } from './lib/db'
import { userFactory } from './user.factory'

export const seenEpisodeFactory = Factory.define<SeenEpisode>(
  ({ onCreate, params }) => {
    onCreate(async (seenEpisodeArgs) => {
      return db
        .insert(seenEpisode)
        .values({
          ...seenEpisodeArgs,
          userId: params.userId ?? (await userFactory.create()).id,
          episodeId: params.episodeId ?? (await episodeFactory.create()).id,
        })
        .returning()
        .then((r) => r[0])
    })

    return {
      userId: params.userId ?? userFactory.build().id,
      episodeId: params.episodeId ?? episodeFactory.build().id,
      createdAt: new Date(Date.now()),
    }
  },
)

/**
 * A helper to create multiple seen episodes in the db for the user.
 */
export const createSeenEpisodesForUser = async (
  episodeIds: number[],
  user?: User,
) => {
  const usedUser = user ?? (await userFactory.create())

  const seenEpisodes = await Promise.all(
    episodeIds.map((episodeId) =>
      seenEpisodeFactory.create({
        episodeId: episodeId,
        userId: usedUser.id,
      }),
    ),
  )

  return {
    user: usedUser,
    seenEpisodes,
  }
}
