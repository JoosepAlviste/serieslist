import { nanoid } from 'nanoid'

import { omdbEpisodeFactory } from '@/features/omdb'
import { db } from '@/lib/db'
import { createContext } from '@/test/testUtils'

import { episodeFactory } from '../episode.factory'
import { seasonFactory } from '../season.factory'
import { seriesFactory } from '../series.factory'
import { syncSeasonsAndEpisodesFromOMDb } from '../series.service'

import { mockOMDbSeasonRequest } from './scopes'

describe('features/series/series.service', () => {
  describe('syncSeasonsAndEpisodesFromOMDb', () => {
    it('imports new episodes into existing seasons', async () => {
      const series = await seriesFactory.create()
      const season = await seasonFactory.create({
        seriesId: series.id,
        number: 1,
      })
      const existingEpisode = await episodeFactory.create({
        seasonId: season.id,
        number: 1,
      })

      const newOMDbEpisode = omdbEpisodeFactory.build({
        Episode: '2',
        imdbID: `tt${nanoid(12)}`,
      })
      mockOMDbSeasonRequest(
        {
          imdbId: series.imdbId,
          seasonNumber: 1,
        },
        {
          Season: '1',
          Episodes: [
            omdbEpisodeFactory.build({
              imdbID: existingEpisode.imdbId,
              Episode: '1',
            }),
            newOMDbEpisode,
          ],
        },
      )

      await syncSeasonsAndEpisodesFromOMDb(createContext())({
        imdbId: series.imdbId,
        seriesId: series.id,
        totalNumberOfSeasons: 1,
      })

      const seasons = await db
        .selectFrom('season')
        .where('seriesId', '=', series.id)
        .selectAll()
        .execute()
      expect(seasons).toHaveLength(1)

      const episodes = await db
        .selectFrom('episode')
        .where('seasonId', '=', seasons[0]!.id)
        .selectAll()
        .execute()
      expect(episodes).toHaveLength(2)
      expect(episodes[0]?.id).toBe(existingEpisode.id)
      expect(episodes[1]?.imdbId).toBe(newOMDbEpisode.imdbID)
    })

    it('does not fail when syncing episodes with N/As', async () => {
      const series = await seriesFactory.create()

      const newEpisode = omdbEpisodeFactory.build({
        Episode: '1',
        Released: 'N/A',
        imdbRating: 'N/A',
      })
      mockOMDbSeasonRequest(
        {
          imdbId: series.imdbId,
          seasonNumber: 1,
        },
        {
          Season: '1',
          Episodes: [newEpisode],
        },
      )

      await syncSeasonsAndEpisodesFromOMDb(createContext())({
        seriesId: series.id,
        imdbId: series.imdbId,
        totalNumberOfSeasons: 1,
      })

      const episode = await db
        .selectFrom('episode')
        .where('imdbId', '=', newEpisode.imdbID)
        .selectAll()
        .executeTakeFirstOrThrow()

      expect(episode).toEqual(
        expect.objectContaining({
          imdbRating: null,
          releasedAt: null,
        }),
      )
    })
  })
})
