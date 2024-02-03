import { seenEpisode, type SeenEpisode } from '@serieslist/db'
import { Factory } from 'fishery'

import { episodeFactory } from '#/features/series'
import { userFactory } from '#/features/users'
import { db } from '#/lib/db'

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
