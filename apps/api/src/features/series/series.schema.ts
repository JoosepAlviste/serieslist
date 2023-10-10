import { type Selectable } from 'kysely'
import { ZodError } from 'zod'

import { type Episode } from '@/generated/db'
import { NotFoundError, UnauthorizedError } from '@/lib/errors'
import { builder } from '@/schemaBuilder'
import { type Context } from '@/types/context'
import { exposeDate } from '@/utils/exposeDate'

import { UserSeriesStatus } from './constants'
import * as episodesService from './episodes.service'
import * as seasonService from './season.service'
import * as seriesService from './series.service'

export const EpisodeRef = builder.objectRef<Selectable<Episode>>('Episode')
EpisodeRef.implement({
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    imdbId: t.exposeString('imdbId', {
      nullable: true,
    }),
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

    season: t.field({
      type: SeasonRef,
      resolve: (parent) => parent.seasonId,
    }),
  }),
})

export const SeasonRef = builder.loadableObjectRef('Season', {
  load: (seasonIds: number[], ctx: Context) => {
    return seasonService.findMany({ ctx, seasonIds })
  },
})
SeasonRef.implement({
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    number: t.exposeInt('number'),
    title: t.exposeString('title'),

    episodes: t.loadableList({
      type: EpisodeRef,
      resolve: (parent) => parent.id,
      load: (ids, ctx) =>
        episodesService.findEpisodesBySeasonIds({ ctx, seasonIds: ids }),
    }),

    series: t.field({
      type: SeriesRef,
      resolve: (parent) => parent.seriesId,
    }),
  }),
})

export const SeriesRef = builder.loadableObjectRef('Series', {
  load: (seriesIds: number[], ctx: Context) => {
    return seriesService.findMany({ ctx, seriesIds })
  },
})
SeriesRef.implement({
  fields: (t) => ({
    id: t.id({
      resolve: (parent) => String(parent.id),
    }),
    title: t.exposeString('title'),
    imdbId: t.exposeString('imdbId', {
      nullable: true,
    }),
    startYear: t.exposeInt('startYear', {
      nullable: true,
    }),
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
      load: (ids, ctx) =>
        seasonService.findSeasonsBySeriesIds({ ctx, seriesIds: ids }),
    }),
  }),
})

builder.objectField(SeriesRef, 'status', (t) =>
  t.loadable({
    type: UserSeriesStatus,
    nullable: true,
    load: (ids: number[], ctx) =>
      seriesService.findStatusForSeries({ ctx, seriesIds: ids }),
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

const UserSeriesListInput = builder.inputType('UserSeriesListInput', {
  fields: (t) => ({
    status: t.field({
      type: UserSeriesStatus,
      required: false,
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
      return seriesService.searchSeries({ ctx, input: args.input })
    },
  }),

  series: t.field({
    type: SeriesRef,
    args: {
      id: t.arg({
        type: 'ID',
        required: true,
        validate: {
          regex: [/^\d+$/, { message: 'The ID must be a number' }],
        },
      }),
    },
    errors: {
      types: [NotFoundError, ZodError],
    },
    resolve(_parent, args, ctx) {
      return seriesService.getSeriesByIdAndFetchDetailsFromTMDB({
        ctx,
        id: parseInt(String(args.id)),
      })
    },
  }),

  userSeriesList: t.authField({
    type: [SeriesRef],
    nullable: false,
    authScopes: {
      authenticated: true,
    },
    errors: {
      types: [UnauthorizedError],
    },
    args: {
      input: t.arg({ type: UserSeriesListInput, required: true }),
    },
    resolve(_parent, args, ctx) {
      return seriesService.findUserSeries({
        ctx,
        status: args.input.status ?? undefined,
      })
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
      types: [NotFoundError, UnauthorizedError],
    },
    resolve: (_parent, args, ctx) => {
      return seriesService.updateSeriesStatusForUser({ ctx, input: args.input })
    },
  }),
}))
