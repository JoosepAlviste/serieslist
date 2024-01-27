import type { SeenEpisode } from '@serieslist/db'
import { Factory } from 'fishery'
import type { Selectable } from 'kysely'

import { episodeFactory } from '#/features/series'
import { userFactory } from '#/features/users'
import { db } from '#/lib/db'

export const seenEpisodeFactory = Factory.define<Selectable<SeenEpisode>>(
  ({ onCreate, params }) => {
    onCreate(async (seenEpisode) => {
      return db
        .insertInto('seenEpisode')
        .returningAll()
        .values({
          ...seenEpisode,
          userId: params.userId ?? (await userFactory.create()).id,
          episodeId: params.episodeId ?? (await episodeFactory.create()).id,
        })
        .executeTakeFirstOrThrow()
    })

    return {
      userId: params.userId ?? userFactory.build().id,
      episodeId: params.episodeId ?? episodeFactory.build().id,
      createdAt: new Date(Date.now()),
    }
  },
)
