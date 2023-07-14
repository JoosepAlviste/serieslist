import { seriesFactory } from '@/features/series'
import { db } from '@/lib/db'
import {
  createContext,
  createSeenEpisodesForUser,
  createSeriesWithEpisodesAndSeasons,
} from '@/test/testUtils'

import { seriesProgressFactory } from '../seriesProgress.factory'
import {
  recalculateSeriesProgress,
  findLatestSeenEpisodesForSeries,
  findNextEpisodesForSeries,
} from '../seriesProgress.service'

describe('features/seriesProgress/seriesProgress.service', () => {
  describe('recalculateSeriesProgress', () => {
    it('recalculates the progress of a series', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1, s1e2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])
      const { user } = await createSeenEpisodesForUser([s1e1.id])

      await recalculateSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        seriesId: series.id,
      })

      const seriesProgress = await db
        .selectFrom('seriesProgress')
        .where('userId', '=', user.id)
        .where('seriesId', '=', series.id)
        .selectAll()
        .executeTakeFirstOrThrow()

      expect(seriesProgress.latestSeenEpisodeId).toBe(s1e1.id)
      expect(seriesProgress.nextEpisodeId).toBe(s1e2.id)
    })

    it('sets the progress to the first episode of the next season if last episode of season', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1],
          },
          {
            episodes: [s2e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1, 1])
      const { user } = await createSeenEpisodesForUser([s1e1.id])

      await recalculateSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        seriesId: series.id,
      })

      const seriesProgress = await db
        .selectFrom('seriesProgress')
        .where('userId', '=', user.id)
        .where('seriesId', '=', series.id)
        .selectAll()
        .executeTakeFirstOrThrow()

      expect(seriesProgress.nextEpisodeId).toBe(s2e1.id)
    })

    it('sets the next episode as null if the last episode was seen', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])
      const { user } = await createSeenEpisodesForUser([s1e1.id])

      await recalculateSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        seriesId: series.id,
      })

      const seriesProgress = await db
        .selectFrom('seriesProgress')
        .where('userId', '=', user.id)
        .where('seriesId', '=', series.id)
        .selectAll()
        .executeTakeFirstOrThrow()

      expect(seriesProgress.nextEpisodeId).toBe(null)
    })

    it('sets the progress to the next non-seen episode', async () => {
      const {
        series,
        seasons: [
          {
            episodes: [s1e1, s1e2, s1e3, s1e4],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([4])
      const { user } = await createSeenEpisodesForUser([
        s1e1.id,
        s1e2.id,
        s1e3.id,
      ])
      await seriesProgressFactory.create({
        userId: user.id,
        seriesId: series.id,
        // The progress shows only the first one as seen
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: s1e2.id,
      })

      await recalculateSeriesProgress({
        ctx: createContext({ currentUser: user }),
        seriesId: series.id,
      })

      const seriesProgress = await db
        .selectFrom('seriesProgress')
        .where('seriesId', '=', series.id)
        .where('userId', '=', user.id)
        .selectAll()
        .executeTakeFirstOrThrow()
      expect(seriesProgress.latestSeenEpisodeId).toBe(s1e3.id)
      expect(seriesProgress.nextEpisodeId).toBe(s1e4.id)
    })
  })

  describe('findLatestSeenEpisodesForSeries', () => {
    it('does not fail if there is no progress one of the series', async () => {
      const series1 = await seriesFactory.create()
      const {
        series: series2,
        seasons: [
          {
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])
      const { user } = await createSeenEpisodesForUser([s1e1.id])
      await seriesProgressFactory.create({
        userId: user.id,
        seriesId: series2.id,
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: null,
      })

      const res = await findLatestSeenEpisodesForSeries({
        ctx: createContext({ currentUser: user }),
        seriesIds: [series1.id, series2.id],
      })

      expect(res[0]).toBeNull()
    })
  })

  describe('findNextEpisodesForSeries', () => {
    it('does not fail if there is no progress one of the series', async () => {
      const series1 = await seriesFactory.create()
      const {
        series: series2,
        seasons: [
          {
            episodes: [s1e1, s1e2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])
      const { user } = await createSeenEpisodesForUser([s1e1.id])
      await seriesProgressFactory.create({
        userId: user.id,
        seriesId: series2.id,
        latestSeenEpisodeId: s1e1.id,
        nextEpisodeId: s1e2.id,
      })

      const res = await findNextEpisodesForSeries({
        ctx: createContext({ currentUser: user }),
        seriesIds: [series1.id, series2.id],
      })

      expect(res[0]).toBeNull()
    })
  })
})
