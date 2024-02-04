import { season } from '@serieslist/core-db'
import type { InsertSeason } from '@serieslist/core-db'
import type { DBContext, Context } from '@serieslist/graphql-server'
import { and, eq, inArray } from 'drizzle-orm'

export const findOne = async ({
  ctx,
  seasonId,
}: {
  ctx: DBContext
  seasonId: number
}) => {
  return (await ctx.db.select().from(season).where(eq(season.id, seasonId))).at(
    0,
  )
}

export const findMany = async ({
  ctx,
  seriesIds,
  seasonIds,
}: {
  ctx: Context
  seriesIds?: number[]
  seasonIds?: number[]
}) => {
  return await ctx.db
    .select()
    .from(season)
    .orderBy(season.number)
    .where(
      and(
        seriesIds ? inArray(season.seriesId, seriesIds) : undefined,
        seasonIds ? inArray(season.id, seasonIds) : undefined,
      ),
    )
}

export const createMany = async ({
  ctx,
  seasons,
}: {
  ctx: DBContext
  seasons: InsertSeason[]
}) => {
  return await ctx.db
    .insert(season)
    .values(seasons)
    .returning()
    .onConflictDoNothing({ target: season.tmdbId })
}

export const deleteOne = async ({
  ctx,
  seasonId,
}: {
  ctx: DBContext
  seasonId: number
}) => {
  return await ctx.db.delete(season).where(eq(season.id, seasonId))
}
