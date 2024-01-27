import type { Series } from '@serieslist/db'
import { Factory } from 'fishery'
import type { Selectable } from 'kysely'
import { nanoid } from 'nanoid'

import { db } from '#/lib/db'
import { generateRandomInt } from '#/utils/generateRandomInt'

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
      tmdbId: generateRandomInt(1, 9999999),
      imdbId: `tt${nanoid(12)}`,
      title: 'Testing Series',
      startYear: 2020,
      poster: null,
      endYear: null,
      imdbRating: null,
      plot: null,
      syncedAt: new Date(Date.now()),
      runtimeMinutes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
)
