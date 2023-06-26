import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { makeFragmentData } from '@/generated/gql'
import {
  type Series,
  SeriesStatusSelect_SeriesFragmentFragmentDoc,
  SeriesUpdateStatusDocument,
  UserSeriesStatus,
  MarkSeriesEpisodesAsSeenDocument,
} from '@/generated/gql/graphql'
import { createMockResolver, render } from '@/lib/testUtils'

import { seriesFactory } from '../../series.factory'

import { SeriesStatusSelect } from './SeriesStatusSelect'

describe('features/series/components/SeriesStatusSelect', () => {
  const renderStatusSelect = async (
    series: Series,
    returnedSeries: Series = seriesFactory.build(),
  ) => {
    const [doc, mockResolver] = createMockResolver(SeriesUpdateStatusDocument, {
      data: {
        seriesUpdateStatus: returnedSeries,
      },
    })

    const [markSeriesEpisodesAsSeenDoc, markSeriesEpisodesAsSeenMockResolver] =
      createMockResolver(MarkSeriesEpisodesAsSeenDocument, {
        data: {
          markSeriesEpisodesAsSeen: returnedSeries,
        },
      })

    const utils = await render(
      <SeriesStatusSelect
        series={makeFragmentData(
          series,
          SeriesStatusSelect_SeriesFragmentFragmentDoc,
        )}
      />,
      {
        requestMocks: [
          [doc, mockResolver],
          [markSeriesEpisodesAsSeenDoc, markSeriesEpisodesAsSeenMockResolver],
        ],
      },
    )

    return {
      ...utils,
      mockResolver,
      markSeriesEpisodesAsSeenMockResolver,
    }
  }

  it('shows the current status of the series', async () => {
    const series = seriesFactory.build({
      id: '1',
      status: UserSeriesStatus.InProgress,
    })

    await renderStatusSelect(series)

    screen.getByText('In progress')
  })

  it('allows changing the status of the given series', async () => {
    const series = seriesFactory.build({
      id: '1',
      status: UserSeriesStatus.InProgress,
    })

    const { mockResolver } = await renderStatusSelect(series, {
      ...series,
      status: UserSeriesStatus.PlanToWatch,
    })

    await userEvent.click(
      screen.getByRole('combobox', {
        name: 'Change status',
      }),
    )
    await userEvent.click(
      screen.getByRole('option', {
        name: 'Plan to watch',
      }),
    )

    expect(mockResolver).toHaveBeenCalledWith({
      input: {
        seriesId: 1,
        status: UserSeriesStatus.PlanToWatch,
      },
    })
  })

  it('shows a toast when changing status', async () => {
    const series = seriesFactory.build()

    await renderStatusSelect(series, {
      ...series,
      status: UserSeriesStatus.PlanToWatch,
    })

    await userEvent.click(
      screen.getByRole('combobox', {
        name: 'Change status',
      }),
    )
    await userEvent.click(
      screen.getByRole('option', {
        name: 'Plan to watch',
      }),
    )

    screen.getByText('Series status changed')
  })

  it('allows marking all series episodes as seen when status is changed to Completed', async () => {
    const series = seriesFactory.build({
      id: '1',
      status: UserSeriesStatus.InProgress,
    })

    const { markSeriesEpisodesAsSeenMockResolver } = await renderStatusSelect(
      series,
      {
        ...series,
        status: UserSeriesStatus.Completed,
      },
    )

    await userEvent.click(
      screen.getByRole('combobox', {
        name: 'Change status',
      }),
    )
    await userEvent.click(
      screen.getByRole('option', {
        name: 'Completed',
      }),
    )

    // An alert dialog is shown
    screen.getByText('Mark all episodes as seen?')

    // The user confirms marking all episodes as seen
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Yes, mark all as seen',
      }),
    )

    expect(markSeriesEpisodesAsSeenMockResolver).toHaveBeenCalledWith({
      input: {
        seriesId: series.id,
      },
    })
  })
})
