import { Factory } from 'fishery'

import { type Season } from '@/generated/gql/graphql'

export const seasonFactory = Factory.define<Season>(({ sequence }) => ({
  __typename: 'Season',
  id: String(sequence),
  number: sequence,
  episodes: [],
}))
