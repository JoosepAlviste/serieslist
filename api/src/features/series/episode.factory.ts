import { Factory } from 'fishery'
import { type Selectable } from 'kysely'
import { nanoid } from 'nanoid'

import { type Episode } from '@/generated/db'
import { db } from '@/lib/db'

import { seasonFactory } from './season.factory'

export const episodeFactory = Factory.define<Selectable<Episode>>(
  ({ sequence, onCreate, params }) => {
    onCreate(async (episode) => {
      return db
        .insertInto('episode')
        .returningAll()
        .values({
          ...episode,
          id: undefined,
          seasonId: params.seasonId ?? (await seasonFactory.create()).id,
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
      seasonId: params.seasonId ?? seasonFactory.build().id,
    }
  },
)
