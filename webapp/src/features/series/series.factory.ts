import { Factory } from 'fishery'

import { type Series } from '@/generated/gql/graphql'

export const seriesFactory = Factory.define<Series>(({ sequence }) => ({
  id: String(sequence),
  imdbId: `tt${sequence}`,
  title: `Test Series ${sequence}`,
  startYear: 1990 + sequence,
  endYear: null,
  poster: null,
}))
