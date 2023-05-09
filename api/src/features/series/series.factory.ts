import { Factory } from 'fishery'
import { type Selectable } from 'kysely'
import { nanoid } from 'nanoid'

import { type Series } from '@/generated/db'
import { db } from '@/lib/db'

export const seriesFactory = Factory.define<Selectable<Series>>(
  ({ sequence, onCreate }) => {
    onCreate((series) => {
      return db
        .insertInto('series')
        .returningAll()
        .values({
          ...series,
          id: undefined,
        })
        .executeTakeFirstOrThrow()
    })

    return {
      id: sequence,
      imdbId: `tt${nanoid(12)}`,
      title: 'Testing Series',
      startYear: 2020,
      poster: null,
      endYear: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
)
