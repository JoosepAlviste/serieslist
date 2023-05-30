import { Factory } from 'fishery'
import { type Selectable } from 'kysely'

import { episodeFactory } from '@/features/series'
import { userFactory } from '@/features/users'
import { type SeenEpisode } from '@/generated/db'
import { db } from '@/lib/db'

export const seenEpisodeFactory = Factory.define<Selectable<SeenEpisode>>(
  ({ onCreate, params }) => {
    onCreate(async (seenEpisode) => {
      const userId =
        params.userId ??
        (
          await db
            .selectFrom('user')
            .selectAll()
            .where('id', '=', seenEpisode.userId)
            .executeTakeFirst()
        )?.id ??
        (await userFactory.create()).id

      const episodeId =
        params.episodeId ??
        (
          await db
            .selectFrom('episode')
            .selectAll()
            .where('id', '=', seenEpisode.episodeId)
            .executeTakeFirst()
        )?.id ??
        (await episodeFactory.create()).id

      return db
        .insertInto('seenEpisode')
        .returningAll()
        .values({
          ...seenEpisode,
          userId,
          episodeId,
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
