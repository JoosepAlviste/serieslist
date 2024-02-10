import { seriesProgress } from '@serieslist/core-db'
import {
  seriesProgressFactory,
  seriesFactory,
  createSeriesWithEpisodesAndSeasons,
  createSeenEpisodesForUser,
} from '@serieslist/core-db-factories'
import { createContext } from '@serieslist/core-graphql-server/test'
import { and, eq } from 'drizzle-orm'

import { db } from '#/lib/db'

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

      const newSeriesProgress = await db.query.seriesProgress.findFirst({
        where: and(
          eq(seriesProgress.userId, user.id),
          eq(seriesProgress.seriesId, series.id),
        ),
      })

      expect(newSeriesProgress!.latestSeenEpisodeId).toBe(s1e1.id)
      expect(newSeriesProgress!.nextEpisodeId).toBe(s1e2.id)
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

      const newSeriesProgress = await db.query.seriesProgress.findFirst({
        where: and(
          eq(seriesProgress.userId, user.id),
          eq(seriesProgress.seriesId, series.id),
        ),
      })

      expect(newSeriesProgress!.nextEpisodeId).toBe(s2e1.id)
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

      const newSeriesProgress = await db.query.seriesProgress.findFirst({
        where: and(
          eq(seriesProgress.userId, user.id),
          eq(seriesProgress.seriesId, series.id),
        ),
      })

      expect(newSeriesProgress!.nextEpisodeId).toBe(null)
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

      const newSeriesProgress = await db.query.seriesProgress.findFirst({
        where: and(
          eq(seriesProgress.userId, user.id),
          eq(seriesProgress.seriesId, series.id),
        ),
      })
      expect(newSeriesProgress!.latestSeenEpisodeId).toBe(s1e3.id)
      expect(newSeriesProgress!.nextEpisodeId).toBe(s1e4.id)
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
