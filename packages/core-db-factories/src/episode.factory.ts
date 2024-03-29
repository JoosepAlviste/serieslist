import { faker } from '@faker-js/faker'
import { episode, type Episode } from '@serieslist/core-db'
import { Factory } from 'fishery'
import { nanoid } from 'nanoid'

import { db } from './lib/db'
import { seasonFactory } from './season.factory'

export const episodeFactory = Factory.define<Episode>(
  ({ sequence, onCreate, params }) => {
    onCreate(async (episodeArgs) => {
      return await db
        .insert(episode)
        .values({
          ...episodeArgs,
          id: undefined,
          seasonId: params.seasonId ?? (await seasonFactory.create()).id,
        })
        .returning()
        .then((r) => r[0])
    })

    return {
      id: sequence,
      tmdbId: faker.number.int(9999999),
      title: 'Test Episode',
      imdbId: `tt${nanoid(12)}`,
      number: sequence,
      imdbRating: '7.6',
      releasedAt: new Date(Date.now()),
      seasonId: params.seasonId ?? seasonFactory.build().id,
    }
  },
)
