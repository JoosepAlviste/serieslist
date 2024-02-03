import { episode, type Episode } from '@serieslist/db'
import { Factory } from 'fishery'
import { nanoid } from 'nanoid'

import { db } from './lib/db'
import { seasonFactory } from './season.factory'
import { generateRandomInt } from './utils/generateRandomInt'

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
      tmdbId: generateRandomInt(1, 9999999),
      title: 'Test Episode',
      imdbId: `tt${nanoid(12)}`,
      number: sequence,
      imdbRating: '7.6',
      releasedAt: new Date(Date.now()),
      seasonId: params.seasonId ?? seasonFactory.build().id,
    }
  },
)
