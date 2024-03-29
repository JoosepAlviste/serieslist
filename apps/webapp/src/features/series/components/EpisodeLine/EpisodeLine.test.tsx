import { stringifyDate } from '@serieslist/util-dates'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { addDays } from 'date-fns'
import React from 'react'

import { makeFragmentData } from '#/generated/gql'
import {
  type Episode,
  EpisodeLine_EpisodeFragmentFragmentDoc,
  EpisodeLine_SeasonFragmentFragmentDoc,
  type Season,
  ToggleEpisodeSeenDocument,
} from '#/generated/gql/graphql'
import { createMockResolver, render } from '#/lib/testUtils'

import { episodeFactory } from '../../episode.factory'
import { seasonFactory } from '../../season.factory'

import { EpisodeLine } from './EpisodeLine'

describe('features/series/components/EpisodeLine', () => {
  const renderEpisodeLine = async ({
    season,
    episode,
    returnedEpisode,
  }: {
    season: Season
    episode: Episode
    returnedEpisode?: Episode
  }) => {
    const [doc, mockResolver] = createMockResolver(ToggleEpisodeSeenDocument, {
      data: {
        toggleEpisodeSeen: returnedEpisode ?? episode,
      },
    })

    const utils = await render(
      <EpisodeLine
        season={makeFragmentData(season, EpisodeLine_SeasonFragmentFragmentDoc)}
        episode={makeFragmentData(
          episode,
          EpisodeLine_EpisodeFragmentFragmentDoc,
        )}
      />,
      {
        requestMocks: [[doc, mockResolver]],
      },
    )

    return {
      ...utils,
      mockResolver,
    }
  }

  it('allows marking an episode as seen', async () => {
    const episode = episodeFactory.build({
      isSeen: false,
    })
    const season = seasonFactory.build()

    const { mockResolver } = await renderEpisodeLine({
      episode,
      season,
      returnedEpisode: {
        ...episode,
        isSeen: true,
      },
    })

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Mark as seen',
      }),
    )

    expect(mockResolver).toHaveBeenCalledWith({
      input: {
        episodeId: parseInt(episode.id),
      },
    })

    // And a toast message is shown
    screen.getByText('Episode marked as seen')
  })

  it('allows marking an episode as not seen', async () => {
    const episode = episodeFactory.build({
      isSeen: true,
    })
    const season = seasonFactory.build()

    const { mockResolver } = await renderEpisodeLine({
      episode,
      season,
      returnedEpisode: {
        ...episode,
        isSeen: false,
      },
    })

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Seen',
      }),
    )

    expect(mockResolver).toHaveBeenCalledWith({
      input: {
        episodeId: parseInt(episode.id),
      },
    })
  })

  it('does not render the mark as seen button if the episode airs in the future', async () => {
    const episode = episodeFactory.build({
      releasedAt: stringifyDate(addDays(new Date(), 1)),
    })

    await renderEpisodeLine({ episode, season: episode.season })

    expect(
      screen.queryByRole('button', { name: 'Mark as seen' }),
    ).not.toBeInTheDocument()
  })
})
