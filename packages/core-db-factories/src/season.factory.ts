import { faker } from '@faker-js/faker'
import { season, type Season } from '@serieslist/core-db'
import { Factory } from 'fishery'

import { db } from './lib/db'
import { seriesFactory } from './series.factory'

export const seasonFactory = Factory.define<Season>(
  ({ sequence, onCreate, params }) => {
    onCreate(async (seasonArgs) => {
      return db
        .insert(season)
        .values({
          ...seasonArgs,
          id: undefined,
          seriesId: params.seriesId ?? (await seriesFactory.create()).id,
        })
        .returning()
        .then((r) => r[0])
    })

    return {
      id: sequence,
      tmdbId: faker.number.int(9999999),
      title: `Season ${sequence}`,
      number: sequence,
      seriesId: params.seriesId ?? seriesFactory.build().id,
    }
  },
)
