import { builder } from '@/schemaBuilder'

import { searchSeries } from './series.service'

export type SeriesType = {
  id: number
  title: string
  imdbId: string
}

const SeriesRef = builder.objectRef<SeriesType>('Series').implement({
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    title: t.exposeString('title'),
    imdbId: t.exposeString('imdbId'),
  }),
})

const SeriesSearchInput = builder.inputType('SeriesSearchInput', {
  fields: (t) => ({
    keyword: t.string({
      required: true,
    }),
  }),
})

builder.queryFields((t) => ({
  seriesSearch: t.authField({
    type: [SeriesRef],
    args: {
      input: t.arg({ type: SeriesSearchInput, required: true }),
    },
    authScopes: {
      authenticated: true,
    },
    resolve(_parent, args) {
      return searchSeries(args.input)
    },
  }),
}))
