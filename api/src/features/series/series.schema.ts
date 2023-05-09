import { type Selectable } from 'kysely'

import { type Series } from '@/generated/db'
import { builder } from '@/schemaBuilder'

import { searchSeries } from './series.service'

export type SeriesType = Pick<
  Selectable<Series>,
  'id' | 'imdbId' | 'title' | 'poster' | 'startYear' | 'endYear'
>

const SeriesRef = builder.objectRef<SeriesType>('Series').implement({
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    title: t.exposeString('title'),
    imdbId: t.exposeString('imdbId'),
    startYear: t.exposeInt('startYear'),
    endYear: t.exposeInt('endYear', {
      nullable: true,
    }),
    poster: t.exposeString('poster', {
      nullable: true,
    }),
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
    resolve(_parent, args, ctx) {
      return searchSeries(ctx)(args.input)
    },
  }),
}))
