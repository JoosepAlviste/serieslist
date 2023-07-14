import { EpisodeRef, SeasonRef, SeriesRef } from '@/features/series'
import { NotFoundError, UnauthorizedError } from '@/lib/errors'
import { builder } from '@/schemaBuilder'

import * as seriesProgressService from './seriesProgress.service'

const ToggleEpisodeSeenInputRef = builder.inputType('ToggleEpisodeSeenInput', {
  fields: (t) => ({
    episodeId: t.int({
      required: true,
    }),
  }),
})

const MarkSeasonEpisodesAsSeenInputRef = builder.inputType(
  'MarkSeasonEpisodesAsSeenInput',
  {
    fields: (t) => ({
      seasonId: t.int({
        required: true,
      }),
    }),
  },
)

const MarkSeriesEpisodesAsSeenInputRef = builder.inputType(
  'MarkSeriesEpisodesAsSeenInput',
  {
    fields: (t) => ({
      seriesId: t.id({
        required: true,
      }),
    }),
  },
)

builder.mutationFields((t) => ({
  toggleEpisodeSeen: t.authField({
    type: EpisodeRef,
    nullable: false,
    authScopes: {
      authenticated: true,
    },
    args: {
      input: t.arg({ type: ToggleEpisodeSeenInputRef, required: true }),
    },
    errors: {
      types: [NotFoundError, UnauthorizedError],
    },
    resolve(_parent, args, ctx) {
      return seriesProgressService.toggleEpisodeSeen({
        ctx,
        episodeId: args.input.episodeId,
      })
    },
  }),

  markSeasonEpisodesAsSeen: t.authField({
    type: SeasonRef,
    nullable: false,
    authScopes: {
      authenticated: true,
    },
    args: {
      input: t.arg({ type: MarkSeasonEpisodesAsSeenInputRef, required: true }),
    },
    errors: {
      types: [NotFoundError, UnauthorizedError],
    },
    resolve(_parent, args, ctx) {
      return seriesProgressService.markSeasonEpisodesAsSeen({
        ctx,
        seasonId: args.input.seasonId,
      })
    },
  }),

  markSeriesEpisodesAsSeen: t.authField({
    type: SeriesRef,
    nullable: false,
    authScopes: {
      authenticated: true,
    },
    args: {
      input: t.arg({ type: MarkSeriesEpisodesAsSeenInputRef, required: true }),
    },
    errors: {
      types: [NotFoundError, UnauthorizedError],
    },
    resolve(_parent, args, ctx) {
      return seriesProgressService.markSeriesEpisodesAsSeen({
        ctx,
        seriesId: parseInt(String(args.input.seriesId)),
      })
    },
  }),
}))

builder.objectField(EpisodeRef, 'isSeen', (t) =>
  t.loadable({
    type: 'Boolean',
    resolve: (episode) => episode.id,
    load: (ids: number[], ctx) => {
      return seriesProgressService.findIsSeenForEpisodes({
        ctx,
        episodeIds: ids,
      })
    },
  }),
)

builder.objectField(SeriesRef, 'latestSeenEpisode', (t) =>
  t
    .withAuth({
      authenticated: true,
    })
    .loadable({
      type: EpisodeRef,
      nullable: true,
      resolve: (parent) => parent.id,
      load: (ids: number[], ctx) => {
        return seriesProgressService.findLatestSeenEpisodesForSeries({
          ctx,
          seriesIds: ids,
        })
      },
    }),
)

builder.objectField(SeriesRef, 'nextEpisode', (t) =>
  t
    .withAuth({
      authenticated: true,
    })
    .loadable({
      type: EpisodeRef,
      nullable: true,
      resolve: (parent) => parent.id,
      load: (ids: number[], ctx) => {
        return seriesProgressService.findNextEpisodesForSeries({
          ctx,
          seriesIds: ids,
        })
      },
    }),
)
