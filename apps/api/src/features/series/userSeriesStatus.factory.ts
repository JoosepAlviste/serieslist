import type { UserSeriesStatus } from '@serieslist/db'
import { UserSeriesStatusStatus } from '@serieslist/db'
import { Factory } from 'fishery'
import type { Selectable } from 'kysely'

import { db } from '#/lib/db'

import { userFactory } from '../users'

import { seriesFactory } from './series.factory'

export const userSeriesStatusFactory = Factory.define<
  Selectable<UserSeriesStatus>
>(({ params, onCreate }) => {
  onCreate(async (userSeriesStatus) => {
    return db
      .insertInto('userSeriesStatus')
      .returningAll()
      .values({
        ...userSeriesStatus,
        userId: params.userId ?? (await userFactory.create()).id,
        seriesId: params.seriesId ?? (await seriesFactory.create()).id,
      })
      .executeTakeFirstOrThrow()
  })

  return {
    status: UserSeriesStatusStatus.InProgress,
    userId: params.userId ?? userFactory.build().id,
    seriesId: params.seriesId ?? seriesFactory.build().id,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  }
})
