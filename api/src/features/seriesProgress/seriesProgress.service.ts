import { findEpisodeById } from '@/features/series'
import { NotFoundError } from '@/lib/errors'
import { type AuthenticatedContext } from '@/types/context'

export const toggleEpisodeSeen =
  (ctx: AuthenticatedContext) => async (episodeId: number) => {
    const episode = await findEpisodeById(ctx)(episodeId)
    if (!episode) {
      throw new NotFoundError()
    }

    const seenEpisode = await ctx.db
      .selectFrom('seenEpisode')
      .where('userId', '=', ctx.currentUser.id)
      .where('episodeId', '=', episodeId)
      .executeTakeFirst()

    if (!seenEpisode) {
      await ctx.db
        .insertInto('seenEpisode')
        .values({
          episodeId: episode.id,
          userId: ctx.currentUser.id,
        })
        .executeTakeFirstOrThrow()
    } else {
      await ctx.db
        .deleteFrom('seenEpisode')
        .where('userId', '=', ctx.currentUser.id)
        .where('episodeId', '=', episodeId)
        .execute()
    }

    return episode
  }
