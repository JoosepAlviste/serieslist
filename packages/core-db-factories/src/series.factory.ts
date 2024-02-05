import { series } from '@serieslist/core-db'
import type { Episode, Season, Series } from '@serieslist/core-db'
import { Factory } from 'fishery'
import { nanoid } from 'nanoid'

import { createArrayOfLength } from './lib/createArrayOfLength'
import { db } from './lib/db'
import { generateRandomInt } from './utils/generateRandomInt'

import { episodeFactory, seasonFactory } from '.'

export const seriesFactory = Factory.define<Series>(
  ({ sequence, onCreate }) => {
    onCreate(async (seriesArg) => {
      return await db
        .insert(series)
        .values({ ...seriesArg, id: undefined })
        .returning()
        .then((r) => r[0])
    })

    return {
      id: sequence,
      tmdbId: generateRandomInt(1, 9999999),
      imdbId: `tt${nanoid(12)}`,
      title: 'Testing Series',
      startYear: 2020,
      poster: null,
      endYear: null,
      imdbRating: null,
      plot: null,
      syncedAt: new Date(Date.now()),
      runtimeMinutes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
)

/**
 * Create series, seasons, and episodes in the database for testing.
 * @param seasonEpisodesCount A list of seasons with the number of episodes
 * to create.
 */
export const createSeriesWithEpisodesAndSeasons = async (
  seasonEpisodesCount: number[],
): Promise<{
  series: Series
  seasons: {
    season: Season
    episodes: Episode[]
  }[]
}> => {
  const series = await seriesFactory.create()

  const seasons = await Promise.all(
    seasonEpisodesCount.map(async (episodesCount, seasonIndex) => {
      const season = await seasonFactory.create({
        seriesId: series.id,
        number: seasonIndex + 1,
      })
      const episodes = await Promise.all(
        createArrayOfLength(episodesCount).map((_, index) => {
          return episodeFactory.create({
            seasonId: season.id,
            number: index + 1,
          })
        }),
      )

      return {
        season,
        episodes,
      }
    }),
  )

  return { series, seasons }
}
