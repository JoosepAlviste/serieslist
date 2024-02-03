import type { UserSeriesStatus } from '@serieslist/db'
import { UserSeriesStatusStatus, userSeriesStatus } from '@serieslist/db'
import { Factory } from 'fishery'

import { db } from './lib/db'
import { seriesFactory } from './series.factory'
import { userFactory } from './user.factory'

export const userSeriesStatusFactory = Factory.define<UserSeriesStatus>(
  ({ params, onCreate }) => {
    onCreate(async (userSeriesStatusArgs) => {
      return db
        .insert(userSeriesStatus)
        .values({
          ...userSeriesStatusArgs,
          userId: params.userId ?? (await userFactory.create()).id,
          seriesId: params.seriesId ?? (await seriesFactory.create()).id,
        })
        .returning()
        .then((r) => r[0])
    })

    return {
      status: UserSeriesStatusStatus.InProgress,
      userId: params.userId ?? userFactory.build().id,
      seriesId: params.seriesId ?? seriesFactory.build().id,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    }
  },
)
