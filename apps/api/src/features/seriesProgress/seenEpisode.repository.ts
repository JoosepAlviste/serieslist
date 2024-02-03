import type { InsertSeenEpisode } from '@serieslist/db'
import { seenEpisode } from '@serieslist/db'
import type { DBContext } from '@serieslist/graphql-server'
import { and, eq, inArray } from 'drizzle-orm'

import { head } from '#/utils/array'

export const findOne = async ({
  ctx,
  userId,
  episodeId,
}: {
  ctx: DBContext
  userId: number
  episodeId: number
}) => {
  return await ctx.db
    .select()
    .from(seenEpisode)
    .where(
      and(eq(seenEpisode.userId, userId), eq(seenEpisode.episodeId, episodeId)),
    )
    .limit(1)
    .then(head)
}

export const findMany = async ({
  ctx,
  userId,
  episodeIds,
}: {
  ctx: DBContext
  userId: number
  episodeIds: number[]
}) => {
  return await ctx.db
    .select()
    .from(seenEpisode)
    .where(
      and(
        eq(seenEpisode.userId, userId),
        inArray(seenEpisode.episodeId, episodeIds),
      ),
    )
}

export const createOne = async ({
  ctx,
  seenEpisode: seenEpisodeArgs,
}: {
  ctx: DBContext
  seenEpisode: InsertSeenEpisode
}) => {
  return await ctx.db.insert(seenEpisode).values(seenEpisodeArgs)
}

export const createMany = async ({
  ctx,
  seenEpisodes,
}: {
  ctx: DBContext
  seenEpisodes: InsertSeenEpisode[]
}) => {
  return await ctx.db
    .insert(seenEpisode)
    .values(seenEpisodes)
    .onConflictDoNothing({
      target: [seenEpisode.episodeId, seenEpisode.userId],
    })
}

export const deleteOne = async ({
  ctx,
  userId,
  episodeId,
}: {
  ctx: DBContext
  userId: number
  episodeId: number
}) => {
  return await ctx.db
    .delete(seenEpisode)
    .where(
      and(eq(seenEpisode.userId, userId), eq(seenEpisode.episodeId, episodeId)),
    )
}
