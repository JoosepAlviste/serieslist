import { Factory } from 'fishery'

import { type Season } from '#/generated/gql/graphql'

import { seriesFactory } from './series.factory'

export const seasonFactory = Factory.define<Season>(({ sequence }) => ({
  __typename: 'Season',
  id: String(sequence),
  title: `Season ${sequence}`,
  number: sequence,
  episodes: [],
  series: seriesFactory.build(),
}))
