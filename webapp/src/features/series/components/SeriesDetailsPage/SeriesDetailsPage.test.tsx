import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import {
  MarkSeasonEpisodesAsSeenDocument,
  SeriesDetailsPageDocument,
} from '@/generated/gql/graphql'
import { createMockResolver, render } from '@/lib/testUtils'

import { episodeFactory } from '../../episode.factory'
import { seasonFactory } from '../../season.factory'
import { seriesFactory } from '../../series.factory'

import { SeriesDetailsPage } from './SeriesDetailsPage'

describe('features/series/components/SeriesDetailsPage', () => {
  it('fetches and renders details for the given series', async () => {
    const series = seriesFactory.build({
      title: 'My Test Series',
      plot: 'Something interesting happens...',
      imdbId: 'tt123',
      startYear: 2020,
      endYear: 2021,
    })

    const [doc, mockResolver] = createMockResolver(SeriesDetailsPageDocument, {
      data: {
        series,
      },
    })

    await render(<SeriesDetailsPage seriesId={series.id} />, {
      requestMocks: [[doc, mockResolver]],
    })

    expect(mockResolver).toHaveBeenCalledOnce()

    screen.getByText('My Test Series')
    screen.getByText('Something interesting happens...')
    screen.getByText('2020 – 2021')
    expect(screen.getByLabelText('IMDb page')).toHaveAttribute(
      'href',
      'https://imdb.com/title/tt123',
    )
  })

  it('renders seasons with episodes', async () => {
    const series = seriesFactory.build({
      seasons: [
        seasonFactory.build({
          number: 1,
          episodes: [
            episodeFactory.build({
              number: 1,
              title: 'First Episode',
            }),
            episodeFactory.build({
              number: 2,
              title: 'Second Episode',
            }),
          ],
        }),
      ],
    })

    const [doc, mockResolver] = createMockResolver(SeriesDetailsPageDocument, {
      data: {
        series,
      },
    })

    await render(<SeriesDetailsPage seriesId={series.id} />, {
      requestMocks: [[doc, mockResolver]],
    })

    screen.getByText('S01E01')
    screen.getByText('First Episode')
    screen.getByText('S01E02')
    screen.getByText('Second Episode')
  })

  it('allows switching between seasons', async () => {
    const series = seriesFactory.build({
      seasons: [
        seasonFactory.build({
          number: 1,
          episodes: [
            episodeFactory.build({
              number: 1,
              title: 'Season one episode',
            }),
          ],
        }),
        seasonFactory.build({
          number: 2,
          episodes: [
            episodeFactory.build({
              number: 1,
              title: 'Season two episode',
            }),
          ],
        }),
      ],
    })

    const [doc, mockResolver] = createMockResolver(SeriesDetailsPageDocument, {
      data: {
        series,
      },
    })

    await render(<SeriesDetailsPage seriesId={series.id} />, {
      requestMocks: [[doc, mockResolver]],
    })

    // Initially the second season episodes are not visible
    expect(screen.queryByText('Season two episode')).not.toBeInTheDocument()

    // The user clicks on the second season tab
    await userEvent.click(screen.getByText('2'))

    // The second season episodes are now visible
    screen.getByText('Season two episode')
    // And the first ones aren't
    expect(screen.queryByText('Season one episode')).not.toBeInTheDocument()
  })

  it('allows marking a season as seen', async () => {
    const season = seasonFactory.build({
      episodes: [
        episodeFactory.build({
          isSeen: false,
        }),
        episodeFactory.build({
          isSeen: false,
        }),
      ],
    })
    const series = seriesFactory.build({
      seasons: [season],
    })

    const [doc, mockResolver] = createMockResolver(
      MarkSeasonEpisodesAsSeenDocument,
      {
        data: {
          markSeasonEpisodesAsSeen: {
            ...season,
            episodes: season.episodes.map((episode) => ({
              ...episode,
              isSeen: true,
            })),
          },
        },
      },
    )

    await render(<SeriesDetailsPage seriesId={series.id} />, {
      requestMocks: [
        createMockResolver(SeriesDetailsPageDocument, {
          data: {
            series,
          },
        }),
        [doc, mockResolver],
      ],
    })

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Mark season as seen',
      }),
    )

    // The mutation was made
    expect(mockResolver).toHaveBeenCalledWith({
      input: {
        seasonId: parseInt(season.id),
      },
    })

    // And the episode buttons now show that they have been seen
    expect(screen.getAllByRole('button', { name: 'Seen' })).toHaveLength(3)
  })
})
