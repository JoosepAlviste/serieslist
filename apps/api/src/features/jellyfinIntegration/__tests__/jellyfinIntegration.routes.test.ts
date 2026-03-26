import { faker } from '@faker-js/faker'
import { seenEpisode } from '@serieslist/core-db'
import { episodeFactory, userFactory } from '@serieslist/core-db-factories'
import {
  mockTMDBSearchEpisodeByIdRequest,
  tmdbEpisodeFactory,
  tmdbFindResponseFactory,
} from '@serieslist/feature-tmdb/test'
import { and, eq } from 'drizzle-orm'

import { db } from '#/lib/db'
import { app } from '#/server'

import type { JellyfinWebhookBody } from '../jellyfinIntegration.types'

describe('jellyfinIntegration.routes', () => {
  const makeWebhookRequest = async ({
    token,
    body,
  }: {
    token: string
    body: Partial<JellyfinWebhookBody>
  }) => {
    await app.inject({
      method: 'POST',
      url: '/api/jellyfin-webhook',
      headers: {
        Authorization: token,
      },
      body: {
        notificationType: 'PlaybackStop',
        playedToCompletion: 'True',
        episodeImdbId: 'imdb-id',
        ...body,
      } satisfies JellyfinWebhookBody,
    })
  }

  it('marks the episode from the request as seen', async () => {
    const token = `token-${faker.string.uuid()}`
    const user = await userFactory.create({
      integrationsToken: token,
    })

    const tmdbId = faker.number.int({ max: 2147483647 })

    const episode = await episodeFactory.create({ tmdbId })

    mockTMDBSearchEpisodeByIdRequest({
      episodeImdbId: 'imdb-id',
      response: tmdbFindResponseFactory.build({
        tv_episode_results: [tmdbEpisodeFactory.build({ id: tmdbId })],
      }),
    })

    await makeWebhookRequest({
      token,
      body: {
        episodeImdbId: 'imdb-id',
        playedToCompletion: 'True',
      },
    })

    const createdSeenEpisode = await db.query.seenEpisode.findFirst({
      where: and(
        eq(seenEpisode.episodeId, episode.id),
        eq(seenEpisode.userId, user.id),
      ),
    })

    expect(createdSeenEpisode).toBeTruthy()
  })

  it("does not mark the episode as seen if it's not played to completion", async () => {
    const token = `token-${faker.string.uuid()}`
    const user = await userFactory.create({
      integrationsToken: token,
    })

    const tmdbId = faker.number.int({ max: 2147483647 })

    const episode = await episodeFactory.create({ tmdbId })

    mockTMDBSearchEpisodeByIdRequest({
      episodeImdbId: 'imdb-id',
      response: tmdbFindResponseFactory.build({
        tv_episode_results: [tmdbEpisodeFactory.build({ id: tmdbId })],
      }),
    })

    await makeWebhookRequest({
      token,
      body: {
        episodeImdbId: 'imdb-id',
        playedToCompletion: 'False',
      },
    })

    const createdSeenEpisode = await db.query.seenEpisode.findFirst({
      where: and(
        eq(seenEpisode.episodeId, episode.id),
        eq(seenEpisode.userId, user.id),
      ),
    })

    expect(createdSeenEpisode).not.toBeTruthy()
  })
})
