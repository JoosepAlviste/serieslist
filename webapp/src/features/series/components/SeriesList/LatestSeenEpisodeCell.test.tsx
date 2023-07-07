import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { makeFragmentData } from '#/generated/gql'
import {
  LatestSeenEpisodeCell_SeriesFragmentFragmentDoc,
  LatestSeenEpisodeToggleEpisodeSeenDocument,
} from '#/generated/gql/graphql'
import { createMockResolver, render } from '#/lib/testUtils'

import { episodeFactory } from '../../episode.factory'
import { seasonFactory } from '../../season.factory'
import { seriesFactory } from '../../series.factory'

import { LatestSeenEpisodeCell } from './LatestSeenEpisodeCell'

describe('features/series/components/SeriesList/LatestSeenEpisodeCell', () => {
  it('renders the latest seen episode', async () => {
    const series = seriesFactory.build({
      latestSeenEpisode: episodeFactory.build({
        number: 1,
        season: seasonFactory.build({
          number: 1,
        }),
      }),
    })

    await render(
      <LatestSeenEpisodeCell
        series={makeFragmentData(
          series,
          LatestSeenEpisodeCell_SeriesFragmentFragmentDoc,
        )}
      />,
    )

    screen.getByText('S01E01')
  })

  it('allows advancing the series progress', async () => {
    const s1e2 = episodeFactory.build()

    const series = seriesFactory.build({
      latestSeenEpisode: episodeFactory.build({
        number: 1,
        season: seasonFactory.build({
          number: 1,
        }),
      }),
      nextEpisode: s1e2,
    })

    const [doc, mockResolver] = createMockResolver(
      LatestSeenEpisodeToggleEpisodeSeenDocument,
      {
        data: {
          toggleEpisodeSeen: s1e2,
        },
      },
    )

    await render(
      <LatestSeenEpisodeCell
        series={makeFragmentData(
          series,
          LatestSeenEpisodeCell_SeriesFragmentFragmentDoc,
        )}
      />,
      {
        requestMocks: [[doc, mockResolver]],
      },
    )

    await userEvent.click(screen.getByText('Mark next episode as seen'))

    expect(mockResolver).toHaveBeenCalledWith({
      input: {
        episodeId: parseInt(s1e2.id),
      },
    })
  })
})
