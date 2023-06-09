import { Factory } from 'fishery'
import { type Selectable } from 'kysely'

import { episodeFactory, seriesFactory } from '@/features/series'
import { userFactory } from '@/features/users'
import { type SeriesProgress } from '@/generated/db'
import { db } from '@/lib/db'

export const seriesProgressFactory = Factory.define<Selectable<SeriesProgress>>(
  ({ params, onCreate }) => {
    onCreate(async (seriesProgress) => {
      return db
        .insertInto('seriesProgress')
        .returningAll()
        .values({
          ...seriesProgress,
          latestSeenEpisodeId:
            params.latestSeenEpisodeId ?? (await episodeFactory.create()).id,
          nextEpisodeId:
            params.nextEpisodeId === undefined
              ? (await episodeFactory.create()).id
              : params.nextEpisodeId,
          seriesId: params.seriesId ?? (await seriesFactory.create()).id,
          userId: params.userId ?? (await userFactory.create()).id,
        })
        .executeTakeFirstOrThrow()
    })

    return {
      userId: params.userId ?? userFactory.build().id,
      seriesId: params.seriesId ?? seriesFactory.build().id,
      latestSeenEpisodeId:
        params.latestSeenEpisodeId ?? episodeFactory.build().id,
      nextEpisodeId:
        params.nextEpisodeId === undefined
          ? episodeFactory.build().id
          : params.nextEpisodeId,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    }
  },
)
