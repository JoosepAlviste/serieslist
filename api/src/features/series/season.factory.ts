import { Factory } from 'fishery'
import { type Selectable } from 'kysely'

import { type Season } from '@/generated/db'
import { db } from '@/lib/db'
import { generateRandomInt } from '@/utils/generateRandomInt'

import { seriesFactory } from './series.factory'

export const seasonFactory = Factory.define<Selectable<Season>>(
  ({ sequence, onCreate, params }) => {
    onCreate(async (season) => {
      return db
        .insertInto('season')
        .returningAll()
        .values({
          ...season,
          id: undefined,
          seriesId: params.seriesId ?? (await seriesFactory.create()).id,
        })
        .executeTakeFirstOrThrow()
    })

    return {
      id: sequence,
      tmdbId: generateRandomInt(1, 9999999),
      title: `Season ${sequence}`,
      number: sequence,
      seriesId: params.seriesId ?? seriesFactory.build().id,
    }
  },
)
