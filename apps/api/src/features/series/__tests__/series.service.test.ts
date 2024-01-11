import {
  tmdbNotFoundResponseFactory,
  tmdbSeasonFactory,
  mockTMDBDetailsRequest,
  mockTMDBSeasonRequest,
} from '@serieslist/tmdb'
import { type LiterallyAnything } from '@serieslist/type-utils'
import { format, subDays } from 'date-fns'

import { seriesProgressFactory } from '#/features/seriesProgress'
import { tmdbEpisodeFactory, tmdbSeriesDetailsFactory } from '#/features/tmdb'
import { userFactory } from '#/features/users'
import { db } from '#/lib/db'
import {
  createContext,
  createSeenEpisodesForUser,
  createSeriesWithEpisodesAndSeasons,
} from '#/test/testUtils'

import { episodeFactory } from '../episode.factory'
import { seasonFactory } from '../season.factory'
import { seriesFactory } from '../series.factory'
import {
  findStatusForSeries,
  reSyncSeries,
  syncSeasonsAndEpisodes,
  syncSeriesDetails,
} from '../series.service'

describe('features/series/series.service', () => {
  describe('syncSeasonsAndEpisodes', () => {
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

      const newTMDBEpisode = tmdbEpisodeFactory.build({
        episode_number: 2,
      })
      mockTMDBSeasonRequest(
        {
          tmdbId: series.tmdbId,
          seasonNumber: 1,
        },
        tmdbSeasonFactory.build({
          season_number: 1,
          episodes: [
            tmdbEpisodeFactory.build(
              {},
              { transient: { savedEpisode: existingEpisode } },
            ),
            newTMDBEpisode,
          ],
        }),
      )

      await syncSeasonsAndEpisodes({
        ctx: createContext(),
        tmdbId: series.tmdbId,
        seriesId: series.id,
        seasons: [season],
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
      expect(episodes[1]?.tmdbId).toBe(newTMDBEpisode.id)
    })

    it('updates existing episodes', async () => {
      const {
        series,
        seasons: [
          {
            season,
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])

      const tmdbEpisodeWithNewData = tmdbEpisodeFactory.build(
        {
          name: 'An updated title',
          air_date: new Date('2023-01-10'),
        },
        {
          transient: { savedEpisode: s1e1 },
        },
      )
      mockTMDBSeasonRequest(
        {
          tmdbId: series.tmdbId,
          seasonNumber: 1,
        },
        tmdbSeasonFactory.build({
          season_number: 1,
          episodes: [tmdbEpisodeWithNewData],
        }),
      )

      await syncSeasonsAndEpisodes({
        ctx: createContext(),
        tmdbId: series.tmdbId,
        seriesId: series.id,
        seasons: [season],
      })

      const episode = await db
        .selectFrom('episode')
        .where('imdbId', '=', s1e1.imdbId)
        .selectAll()
        .executeTakeFirstOrThrow()
      expect(episode.title).toBe('An updated title')
      expect(format(episode.releasedAt!, 'yyyy-MM-dd')).toBe('2023-01-10')
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

      mockTMDBSeasonRequest(
        {
          tmdbId: series.tmdbId,
          seasonNumber: 1,
        },
        tmdbSeasonFactory.build({
          season_number: 1,
          episodes: [
            tmdbEpisodeFactory.build(
              {},
              { transient: { savedEpisode: existingEpisode } },
            ),
          ],
        }),
      )

      await syncSeasonsAndEpisodes({
        ctx: createContext(),
        tmdbId: series.tmdbId,
        seriesId: series.id,
        seasons: [season],
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
            season,
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

      const newTMDBEpisode = tmdbEpisodeFactory.build({
        episode_number: 2,
      })
      mockTMDBSeasonRequest(
        {
          tmdbId: series.tmdbId,
          seasonNumber: 1,
        },
        tmdbSeasonFactory.build({
          season_number: 1,
          episodes: [
            tmdbEpisodeFactory.build({}, { transient: { savedEpisode: s1e1 } }),
            newTMDBEpisode,
            tmdbEpisodeFactory.build({
              episode_number: 3,
            }),
          ],
        }),
      )

      await syncSeasonsAndEpisodes({
        ctx: createContext(),
        tmdbId: series.tmdbId,
        seriesId: series.id,
        seasons: [season],
      })

      const newEpisode = await db
        .selectFrom('episode')
        .where('tmdbId', '=', newTMDBEpisode.id)
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

    it('deletes the season if it has been deleted in TMDB', async () => {
      const {
        series,
        seasons: [{ season }],
      } = await createSeriesWithEpisodesAndSeasons([0])

      mockTMDBSeasonRequest(
        { tmdbId: series.tmdbId, seasonNumber: season.number },
        tmdbNotFoundResponseFactory.build(),
      )

      await syncSeasonsAndEpisodes({
        ctx: createContext(),
        seriesId: series.id,
        tmdbId: series.tmdbId,
        seasons: [season],
      })

      const savedSeason = await db
        .selectFrom('season')
        .where('id', '=', season.id)
        .executeTakeFirst()
      expect(savedSeason).toBeFalsy()
    })

    it('does not delete the season if there is a parsing error', async () => {
      const {
        series,
        seasons: [{ season }],
      } = await createSeriesWithEpisodesAndSeasons([0])

      mockTMDBSeasonRequest(
        { tmdbId: series.tmdbId, seasonNumber: season.number },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        { not: 'correct' } as LiterallyAnything,
      )

      await syncSeasonsAndEpisodes({
        ctx: createContext(),
        seriesId: series.id,
        tmdbId: series.tmdbId,
        seasons: [season],
      })

      const savedSeason = await db
        .selectFrom('season')
        .where('id', '=', season.id)
        .executeTakeFirst()
      expect(savedSeason).not.toBeFalsy()
    })

    it('deletes an episode if it has been deleted in TMDB', async () => {
      // TODO: What happens to series progress?
      // TODO: What if the episode is the only one in the season?
      const {
        series,
        seasons: [
          {
            season,
            episodes: [s1e1, s1e2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])

      mockTMDBSeasonRequest(
        { tmdbId: series.tmdbId, seasonNumber: season.number },
        tmdbSeasonFactory.build({
          season_number: season.number,
          episodes: [
            tmdbEpisodeFactory.build({}, { transient: { savedEpisode: s1e1 } }),
          ],
        }),
      )

      await syncSeasonsAndEpisodes({
        ctx: createContext(),
        seriesId: series.id,
        tmdbId: series.tmdbId,
        seasons: [season],
      })

      const savedEpisode = await db
        .selectFrom('episode')
        .where('id', '=', s1e2.id)
        .executeTakeFirst()
      expect(savedEpisode).toBeFalsy()
      const savedEpisodeThatShouldStillExist = await db
        .selectFrom('episode')
        .where('id', '=', s1e1.id)
        .executeTakeFirst()
      expect(savedEpisodeThatShouldStillExist).toBeTruthy()
    })
  })

  describe('syncSeriesDetails', () => {
    it('does not sync seasons if there are none', async () => {
      const series = await seriesFactory.create()

      mockTMDBDetailsRequest(
        series.tmdbId,
        tmdbSeriesDetailsFactory.build({
          id: series.tmdbId,
          number_of_seasons: 0,
          seasons: [],
        }),
      )

      await syncSeriesDetails({
        ctx: createContext(),
        tmdbId: series.tmdbId,
      })
    })

    it('deletes a series if it has been deleted in TMDB', async () => {
      const series = await seriesFactory.create()

      mockTMDBDetailsRequest(series.tmdbId, tmdbNotFoundResponseFactory.build())

      const returnedSeries = await syncSeriesDetails({
        ctx: createContext(),
        tmdbId: series.tmdbId,
      })

      expect(returnedSeries).toBe(null)

      const seriesInDb = await db
        .selectFrom('series')
        .where('id', '=', series.id)
        .selectAll()
        .executeTakeFirst()
      expect(seriesInDb).toBe(undefined)
    })

    it('does not delete the series if parsing the TMDB response fails', async () => {
      const series = await seriesFactory.create()

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      mockTMDBDetailsRequest(series.tmdbId, {
        not: 'correct',
      } as LiterallyAnything)

      const returnedSeries = await syncSeriesDetails({
        ctx: createContext(),
        tmdbId: series.tmdbId,
      })

      expect(returnedSeries).toBe(null)

      const seriesInDb = await db
        .selectFrom('series')
        .where('id', '=', series.id)
        .selectAll()
        .executeTakeFirst()
      expect(seriesInDb).not.toBeFalsy()
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

  describe('reSyncSeries', () => {
    it('re-syncs series from TMDB', async () => {
      const series = await seriesFactory.create({
        syncedAt: subDays(new Date(), 8),
      })

      const scope = mockTMDBDetailsRequest(
        series.tmdbId,
        tmdbSeriesDetailsFactory.build(
          {
            name: 'Updated Title',
            number_of_seasons: 0,
            seasons: [],
          },
          { transient: { savedSeries: series } },
        ),
      )

      await reSyncSeries({ ctx: createContext() })

      scope.done()

      const savedSeries = await db
        .selectFrom('series')
        .where('id', '=', series.id)
        .selectAll()
        .executeTakeFirstOrThrow()
      expect(savedSeries.title).toBe('Updated Title')
    })

    it("does not re-sync series that haven't been synced before", async () => {
      const series = await seriesFactory.create({
        syncedAt: null,
      })

      const scope = mockTMDBDetailsRequest(
        series.tmdbId,
        tmdbSeriesDetailsFactory.build(
          {},
          { transient: { savedSeries: series } },
        ),
      )

      await reSyncSeries({ ctx: createContext() })

      expect(scope.isDone()).toBeFalsy()
    })

    it('does not re-sync series that have recently been synced', async () => {
      const series = await seriesFactory.create({
        syncedAt: subDays(new Date(), 6),
      })

      const scope = mockTMDBDetailsRequest(
        series.tmdbId,
        tmdbSeriesDetailsFactory.build(
          {},
          { transient: { savedSeries: series } },
        ),
      )

      await reSyncSeries({ ctx: createContext() })

      expect(scope.isDone()).toBeFalsy()
    })

    it('re-syncs multiple series', async () => {
      const seriesToSync = await seriesFactory.createList(2, {
        syncedAt: subDays(new Date(), 9),
      })

      const seriesToSyncScopes = seriesToSync.map((series) =>
        mockTMDBDetailsRequest(
          series.tmdbId,
          tmdbSeriesDetailsFactory.build(
            {},
            { transient: { savedSeries: series } },
          ),
        ),
      )

      await reSyncSeries({ ctx: createContext() })

      seriesToSyncScopes.forEach((scope) => {
        scope.done()
      })
    })
  })
})
