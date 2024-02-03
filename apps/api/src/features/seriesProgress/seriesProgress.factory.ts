import { seriesProgress, type SeriesProgress } from '@serieslist/db'
import { Factory } from 'fishery'

import { episodeFactory, seriesFactory } from '#/features/series'
import { userFactory } from '#/features/users'
import { db } from '#/lib/db'

export const seriesProgressFactory = Factory.define<SeriesProgress>(
  ({ params, onCreate }) => {
    onCreate(async (seriesProgressArgs) => {
      return db
        .insert(seriesProgress)
        .values({
          ...seriesProgressArgs,
          latestSeenEpisodeId:
            params.latestSeenEpisodeId ?? (await episodeFactory.create()).id,
          nextEpisodeId:
            params.nextEpisodeId === undefined
              ? (await episodeFactory.create()).id
              : params.nextEpisodeId,
          seriesId: params.seriesId ?? (await seriesFactory.create()).id,
          userId: params.userId ?? (await userFactory.create()).id,
        })
        .returning()
        .then((r) => r[0])
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
