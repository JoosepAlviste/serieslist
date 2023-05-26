import { type Selectable } from 'kysely'

import { type Episode, type Season, type Series } from '@/generated/db'
import { NotFoundError } from '@/lib/errors'
import { builder } from '@/schemaBuilder'
import { exposeDate } from '@/utils/exposeDate'

import { UserSeriesStatus } from './constants'
import {
  findEpisodesBySeasonIds,
  findSeasonsBySeriesIds,
  findStatusForSeries,
  getSeriesByIdAndFetchDetailsFromOmdb,
  searchSeries,
  updateSeriesStatusForUser,
} from './series.service'

export type EpisodeType = Selectable<Episode>

export type SeasonType = Selectable<Season>

export type SeriesType = Selectable<Series>

const EpisodeRef = builder.objectRef<EpisodeType>('Episode').implement({
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    imdbId: t.exposeString('imdbId'),
    number: t.exposeInt('number'),
    title: t.exposeString('title'),
    releasedAt: t.field({
      type: 'Date',
      nullable: true,
      resolve: exposeDate('releasedAt'),
    }),
    imdbRating: t.field({
      type: 'Float',
      nullable: true,
      resolve: ({ imdbRating }) => (imdbRating ? parseFloat(imdbRating) : null),
    }),
  }),
})

const SeasonRef = builder.objectRef<SeasonType>('Season').implement({
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    number: t.exposeInt('number'),

    episodes: t.loadableList({
      type: EpisodeRef,
      resolve: (parent) => parent.id,
      load: (ids, ctx) => findEpisodesBySeasonIds(ctx)(ids),
    }),
  }),
})

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
    plot: t.exposeString('plot', {
      nullable: true,
    }),

    seasons: t.loadableList({
      type: SeasonRef,
      resolve: (parent) => parent.id,
      load: (ids, ctx) => findSeasonsBySeriesIds(ctx)(ids),
    }),
  }),
})

builder.objectField(SeriesRef, 'status', (t) =>
  t.loadable({
    type: UserSeriesStatus,
    nullable: true,
    load: (ids: number[], context) => findStatusForSeries(context)(ids),
    resolve: (series) => series.id,
  }),
)

const SeriesSearchInput = builder.inputType('SeriesSearchInput', {
  fields: (t) => ({
    keyword: t.string({
      required: true,
    }),
  }),
})

builder.queryFields((t) => ({
  seriesSearch: t.field({
    type: [SeriesRef],
    args: {
      input: t.arg({ type: SeriesSearchInput, required: true }),
    },
    resolve(_parent, args, ctx) {
      return searchSeries(ctx)(args.input)
    },
  }),

  series: t.field({
    type: SeriesRef,
    args: {
      id: t.arg({ type: 'ID', required: true }),
    },
    errors: {
      types: [NotFoundError],
    },
    resolve(_parent, args, ctx) {
      return getSeriesByIdAndFetchDetailsFromOmdb(ctx)(
        parseInt(String(args.id)),
      )
    },
  }),
}))

builder.enumType(UserSeriesStatus, {
  name: 'UserSeriesStatus',
})

const SeriesUpdateStatusInputRef = builder.inputType(
  'SeriesUpdateStatusInput',
  {
    fields: (t) => ({
      seriesId: t.int({
        required: true,
      }),
      status: t.field({
        type: UserSeriesStatus,
      }),
    }),
  },
)

builder.mutationFields((t) => ({
  seriesUpdateStatus: t.authField({
    type: SeriesRef,
    nullable: false,
    authScopes: {
      authenticated: true,
    },
    args: {
      input: t.arg({
        type: SeriesUpdateStatusInputRef,
        required: true,
      }),
    },
    errors: {
      types: [NotFoundError],
    },
    resolve: (_parent, args, ctx) => {
      return updateSeriesStatusForUser(ctx)(args.input)
    },
  }),
}))
