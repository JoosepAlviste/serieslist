import { randomBytes } from 'node:crypto'

import type { AuthenticatedContext } from '@serieslist/core-graphql-server'
import { tmdbService } from '@serieslist/feature-tmdb'

import { config } from '#/config'
import { usersService } from '#/features/users'
import { log } from '#/lib/logger'

import { episodesService } from '../series'
import { seriesProgressService } from '../seriesProgress'

import type { IntegrationSettings } from './integrationSettings.types'
import type { JellyfinWebhookBody } from './jellyfinIntegration.types'

const getEnvPrefix = () => {
  return {
    production: 'prod',
    test: 'test',
    development: 'dev',
  }[config.environment]
}

const generateToken = (length: number) => {
  return `serieslist_${getEnvPrefix()}_${Buffer.from(randomBytes(length)).toString('hex')}`
}

export const generateIntegrationsToken = async ({
  ctx,
}: {
  ctx: AuthenticatedContext
}) => {
  const newToken = generateToken(32)

  await usersService.updateIntegrationsToken({
    ctx,
    userId: ctx.currentUser.id,
    integrationsToken: newToken,
  })

  return newToken
}

export const getIntegrationSettings = ({
  ctx,
}: {
  ctx: AuthenticatedContext
}): IntegrationSettings => {
  return {
    integrationToken: ctx.currentUser.integrationsToken,
  }
}

export const markEpisodeAsSeen = async ({
  ctx,
  webhookBody,
}: {
  ctx: AuthenticatedContext
  webhookBody: JellyfinWebhookBody
}) => {
  if (
    webhookBody.playedToCompletion !== 'True' ||
    webhookBody.notificationType !== 'PlaybackStop'
  ) {
    return
  }

  const { episode: tmdbEpisode, parsed } =
    await tmdbService.searchEpisodeByImdbId({
      episodeImdbId: webhookBody.episodeImdbId,
    })

  if (!parsed) {
    log.warn(
      { episodeImdbId: webhookBody.episodeImdbId, userId: ctx.currentUser.id },
      '[jellyfin webhook] could not parse find episode response from TMDB',
    )

    return
  }

  if (!tmdbEpisode) {
    log.info(
      { episodeImdbId: webhookBody.episodeImdbId, userId: ctx.currentUser.id },
      '[jellyfin webhook] did not find episode from TMDB',
    )

    return
  }

  const episode = await episodesService.findOneWithSeasonAndSeriesInfo({
    ctx,
    tmdbEpisodeId: tmdbEpisode.id,
  })

  if (!episode) {
    log.info(
      { tmdbEpisodeId: tmdbEpisode.id, userId: ctx.currentUser.id },
      '[jellyfin webhook] did not find episode',
    )

    return
  }

  await seriesProgressService.markEpisodeAsSeen({
    ctx,
    episode,
  })

  log.info(
    {
      tmdbEpisodeId: tmdbEpisode.id,
      userId: ctx.currentUser.id,
      episodeId: episode.id,
    },
    '[jellyfin webhook] marked episode as seen',
  )
}
