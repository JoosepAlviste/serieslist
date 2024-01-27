import { format, subDays } from 'date-fns'
import { Factory } from 'fishery'

import type { Episode } from '#/generated/gql/graphql'

import { seasonFactory } from './season.factory'

export const episodeFactory = Factory.define<Episode>(({ sequence }) => ({
  __typename: 'Episode',
  id: String(sequence),
  number: sequence,
  title: 'Test Episode',
  imdbId: 'tt123',
  imdbRating: 4.4,
  isSeen: false,
  releasedAt: format(subDays(new Date(Date.now()), 1), 'yyyy-MM-dd'),
  season: seasonFactory.build(),
}))
