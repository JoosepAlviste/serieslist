import { type Context } from '@/types/context'

export const findEpisodeById = (ctx: Context) => async (episodeId: number) => {
  return await ctx.db
    .selectFrom('episode')
    .where('id', '=', episodeId)
    .selectAll()
    .executeTakeFirst()
}
