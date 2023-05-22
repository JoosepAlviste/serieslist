import { Factory } from 'fishery'
import { type Selectable } from 'kysely'

import { type Season } from '@/generated/db'
import { db } from '@/lib/db'

import { seriesFactory } from './series.factory'

export const seasonFactory = Factory.define<Selectable<Season>>(
  ({ sequence, onCreate, associations, params }) => {
    onCreate(async (season) => {
      const seriesId =
        associations.seriesId ??
        params.seriesId ??
        (
          await db
            .selectFrom('series')
            .selectAll()
            .where('id', '=', season.seriesId)
            .executeTakeFirst()
        )?.id ??
        (await seriesFactory.create()).id

      return db
        .insertInto('season')
        .returningAll()
        .values({
          ...season,
          id: undefined,
          seriesId,
        })
        .executeTakeFirstOrThrow()
    })

    return {
      id: sequence,
      number: sequence,
      seriesId: associations.seriesId ?? seriesFactory.build().id,
    }
  },
)
