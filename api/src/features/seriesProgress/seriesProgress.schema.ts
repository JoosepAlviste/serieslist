import { EpisodeRef } from '@/features/series'
import { NotFoundError, UnauthorizedError } from '@/lib/errors'
import { builder } from '@/schemaBuilder'

import { toggleEpisodeSeen } from './seriesProgress.service'

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
      return toggleEpisodeSeen(ctx)(args.input.episodeId)
    },
  }),
}))
