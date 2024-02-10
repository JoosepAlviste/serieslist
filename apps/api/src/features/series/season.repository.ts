import { season } from '@serieslist/core-db'
import type { DBContext } from '@serieslist/core-graphql-server'
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
  ctx: DBContext
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

export const deleteOne = async ({
  ctx,
  seasonId,
}: {
  ctx: DBContext
  seasonId: number
}) => {
  return await ctx.db.delete(season).where(eq(season.id, seasonId))
}
