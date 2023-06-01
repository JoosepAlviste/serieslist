import { EpisodeRef } from '@/features/series'
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
