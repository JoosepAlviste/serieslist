import { season, type InsertSeason } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
import { eq } from 'drizzle-orm'

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
