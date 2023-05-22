import { Factory } from 'fishery'
import { type Selectable } from 'kysely'
import { nanoid } from 'nanoid'

import { type Episode } from '@/generated/db'
import { db } from '@/lib/db'

import { seasonFactory } from './season.factory'

export const episodeFactory = Factory.define<Selectable<Episode>>(
  ({ sequence, onCreate, associations, params }) => {
    onCreate(async (episode) => {
      const seasonId =
        associations.seasonId ??
        params.seasonId ??
        (
          await db
            .selectFrom('season')
            .selectAll()
            .where('id', '=', episode.seasonId)
            .executeTakeFirst()
        )?.id ??
        (await seasonFactory.create()).id

      return db
        .insertInto('episode')
        .returningAll()
        .values({
          ...episode,
          id: undefined,
          seasonId,
        })
        .executeTakeFirstOrThrow()
    })

    return {
      id: sequence,
      title: 'Test Episode',
      imdbId: `tt${nanoid(12)}`,
      number: sequence,
      imdbRating: '7.6',
      releasedAt: new Date(Date.now()),
      seasonId: associations.seasonId ?? seasonFactory.build().id,
    }
  },
)
