import { nanoid } from 'nanoid'

import { omdbEpisodeFactory, omdbSeriesDetailsFactory } from '@/features/omdb'
import { seriesProgressFactory } from '@/features/seriesProgress'
import { userFactory } from '@/features/users'
import { db } from '@/lib/db'
import {
  createContext,
  createSeenEpisodesForUser,
  createSeriesWithEpisodesAndSeasons,
} from '@/test/testUtils'

import { episodeFactory } from '../episode.factory'
import { seasonFactory } from '../season.factory'
import { seriesFactory } from '../series.factory'
import {
  findStatusForSeries,
  syncSeasonsAndEpisodesFromOMDb,
  syncSeriesDetailsFromOMDb,
} from '../series.service'

import { mockOMDbDetailsRequest, mockOMDbSeasonRequest } from './scopes'

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
            omdbEpisodeFactory.build(
              {},
              { transient: { savedEpisode: existingEpisode } },
            ),
            newOMDbEpisode,
          ],
        },
      )

      await syncSeasonsAndEpisodesFromOMDb({
        ctx: createContext(),
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

      await syncSeasonsAndEpisodesFromOMDb({
        ctx: createContext(),
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

    it("does not fail when there's nothing to import", async () => {
      const series = await seriesFactory.create()
      const season = await seasonFactory.create({
        seriesId: series.id,
        number: 1,
      })
      const existingEpisode = await episodeFactory.create({
        seasonId: season.id,
        number: 1,
      })

      mockOMDbSeasonRequest(
        {
          imdbId: series.imdbId,
          seasonNumber: 1,
        },
        {
          Season: '1',
          Episodes: [
            omdbEpisodeFactory.build(
              {},
              { transient: { savedEpisode: existingEpisode } },
            ),
          ],
        },
      )

      await syncSeasonsAndEpisodesFromOMDb({
        ctx: createContext(),
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
      expect(episodes).toHaveLength(1)
      expect(episodes[0]?.id).toBe(existingEpisode.id)
    })

    it('advances series progress for all users when new episodes are imported', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])
      const { user: user1 } = await createSeenEpisodesForUser([s1e1.id])
      const { user: user2 } = await createSeenEpisodesForUser([s1e1.id])
      await seriesProgressFactory.create({
        userId: user1.id,
        seriesId: series.id,
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: null,
      })
      await seriesProgressFactory.create({
        userId: user2.id,
        seriesId: series.id,
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: null,
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
            omdbEpisodeFactory.build({}, { transient: { savedEpisode: s1e1 } }),
            newOMDbEpisode,
            omdbEpisodeFactory.build({
              Episode: '3',
              imdbID: `tt${nanoid(12)}`,
            }),
          ],
        },
      )

      await syncSeasonsAndEpisodesFromOMDb({
        ctx: createContext(),
        imdbId: series.imdbId,
        seriesId: series.id,
        totalNumberOfSeasons: 1,
      })

      const newEpisode = await db
        .selectFrom('episode')
        .where('imdbId', '=', newOMDbEpisode.imdbID)
        .selectAll()
        .executeTakeFirstOrThrow()
      const seriesProgresses = await db
        .selectFrom('seriesProgress')
        .where('seriesId', '=', series.id)
        .where('nextEpisodeId', '=', newEpisode.id)
        .selectAll()
        .execute()
      expect(seriesProgresses).toHaveLength(2)
    })
  })

  describe('syncSeriesDetailsFromOMDb', () => {
    it('does not sync seasons if there are none', async () => {
      const series = await seriesFactory.create()

      mockOMDbDetailsRequest(
        series.imdbId,
        omdbSeriesDetailsFactory.build({
          imdbID: series.imdbId,
          totalSeasons: 'N/A',
        }),
      )

      await syncSeriesDetailsFromOMDb({
        ctx: createContext(),
        imdbId: series.imdbId,
      })
    })
  })

  describe('findStatusForSeries', () => {
    it('returns null if there is no status for the user', async () => {
      const series = await seriesFactory.create()
      const user = await userFactory.create()

      const status = await findStatusForSeries({
        ctx: createContext({
          currentUser: user,
        }),
        seriesIds: [series.id],
      })

      expect(status[0]).toBeNull()
    })
  })
})
