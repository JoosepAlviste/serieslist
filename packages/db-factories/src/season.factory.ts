import { season, type Season } from '@serieslist/db'
import { Factory } from 'fishery'

import { db } from './lib/db'
import { seriesFactory } from './series.factory'
import { generateRandomInt } from './utils/generateRandomInt'

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
      tmdbId: generateRandomInt(1, 9999999),
      title: `Season ${sequence}`,
      number: sequence,
      seriesId: params.seriesId ?? seriesFactory.build().id,
    }
  },
)
