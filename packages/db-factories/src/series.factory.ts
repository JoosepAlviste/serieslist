import { series, type Series } from '@serieslist/db'
import { Factory } from 'fishery'
import { nanoid } from 'nanoid'

import { db } from './lib/db'
import { generateRandomInt } from './utils/generateRandomInt'

export const seriesFactory = Factory.define<Series>(
  ({ sequence, onCreate }) => {
    onCreate(async (seriesArg) => {
      return await db
        .insert(series)
        .values({ ...seriesArg, id: undefined })
        .returning()
        .then((r) => r[0])
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
