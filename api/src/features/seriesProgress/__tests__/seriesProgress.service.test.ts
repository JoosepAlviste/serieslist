import { userFactory } from '@/features/users'
import { db } from '@/lib/db'
import {
  createContext,
  createSeenEpisodesForUser,
  createSeriesWithEpisodesAndSeasons,
} from '@/test/testUtils'

import {
  advanceSeriesProgress,
  decreaseSeriesProgress,
} from '../seriesProgress.service'

describe('features/seriesProgress/seriesProgress.service', () => {
  describe('advanceSeriesProgress', () => {
    it('advances the progress of a series', async () => {
      const user = await userFactory.create()

      const {
        series,
        seasons: [
          {
            episodes: [s1e1, s1e2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])

      await advanceSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        latestSeenEpisodeId: s1e1.id,
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
      const user = await userFactory.create()

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

      await advanceSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        latestSeenEpisodeId: s1e1.id,
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
      const user = await userFactory.create()

      const {
        series,
        seasons: [
          {
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])

      await advanceSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        latestSeenEpisodeId: s1e1.id,
      })

      const seriesProgress = await db
        .selectFrom('seriesProgress')
        .where('userId', '=', user.id)
        .where('seriesId', '=', series.id)
        .selectAll()
        .executeTakeFirstOrThrow()

      expect(seriesProgress.nextEpisodeId).toBe(null)
    })
  })

  describe('decreaseSeriesProgress', () => {
    it('decreases the progress of a series', async () => {
      const user = await userFactory.create()

      const {
        series,
        seasons: [
          {
            episodes: [s1e1, s1e2],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2])

      await createSeenEpisodesForUser([s1e1.id, s1e2.id], user)

      await decreaseSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        previousLatestSeenEpisodeId: s1e2.id,
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

    it('sets the progress to the last episode of the previous season if first episode of the season', async () => {
      const user = await userFactory.create()

      const {
        series,
        seasons: [
          {
            episodes: [, s1e2],
          },
          {
            episodes: [s2e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([2, 1])

      await decreaseSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        previousLatestSeenEpisodeId: s2e1.id,
      })

      const seriesProgress = await db
        .selectFrom('seriesProgress')
        .where('userId', '=', user.id)
        .where('seriesId', '=', series.id)
        .selectAll()
        .executeTakeFirstOrThrow()

      expect(seriesProgress.latestSeenEpisodeId).toBe(s1e2.id)
      expect(seriesProgress.nextEpisodeId).toBe(s2e1.id)
    })

    it('deletes the series progress if there was only one episode as seen', async () => {
      const user = await userFactory.create()

      const {
        series,
        seasons: [
          {
            episodes: [s1e1],
          },
        ],
      } = await createSeriesWithEpisodesAndSeasons([1])

      await decreaseSeriesProgress({
        ctx: createContext({
          currentUser: user,
        }),
        previousLatestSeenEpisodeId: s1e1.id,
      })

      const seriesProgress = await db
        .selectFrom('seriesProgress')
        .where('userId', '=', user.id)
        .where('seriesId', '=', series.id)
        .selectAll()
        .executeTakeFirst()

      expect(seriesProgress).toBeFalsy()
    })
  })
})
