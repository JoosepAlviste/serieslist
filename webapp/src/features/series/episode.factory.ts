import { format } from 'date-fns'
import { Factory } from 'fishery'

import { type Episode } from '@/generated/gql/graphql'

export const episodeFactory = Factory.define<Episode>(({ sequence }) => ({
  __typename: 'Episode',
  id: String(sequence),
  number: sequence,
  title: 'Test Episode',
  imdbId: 'tt123',
  imdbRating: 4.4,
  releasedAt: format(new Date(Date.now()), 'yyyy-MM-dd'),
}))