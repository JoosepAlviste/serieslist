import { episodesService } from '@/features/series'
import { NotFoundError } from '@/lib/errors'
import { type AuthenticatedContext } from '@/types/context'

import * as seenEpisodeRepository from './seenEpisode.repository'

export const toggleEpisodeSeen = async ({
  ctx,
  episodeId,
}: {
  ctx: AuthenticatedContext
  episodeId: number
}) => {
  const episode = await episodesService.findOne({ ctx, episodeId })
  if (!episode) {
    throw new NotFoundError()
  }

  const seenEpisode = await seenEpisodeRepository.findOne({
    ctx,
    episodeId,
    userId: ctx.currentUser.id,
  })

  if (!seenEpisode) {
    await seenEpisodeRepository.createOne({
      ctx,
      seenEpisode: {
        episodeId: episode.id,
        userId: ctx.currentUser.id,
      },
    })
  } else {
    await seenEpisodeRepository.deleteOne({
      ctx,
      userId: ctx.currentUser.id,
      episodeId: episode.id,
    })
  }

  return episode
}
