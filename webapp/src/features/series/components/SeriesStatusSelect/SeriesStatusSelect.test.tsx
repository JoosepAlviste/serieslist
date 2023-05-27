import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { makeFragmentData } from '@/generated/gql'
import {
  SeriesStatusSelect_SeriesFragmentFragmentDoc,
  SeriesUpdateStatusDocument,
  UserSeriesStatus,
} from '@/generated/gql/graphql'
import { createMockResolver, render } from '@/lib/testUtils'

import { seriesFactory } from '../../series.factory'

import { SeriesStatusSelect } from './SeriesStatusSelect'

describe('features/series/components/SeriesStatusSelect', () => {
  it('shows the current status of the series', async () => {
    const series = seriesFactory.build({
      id: '1',
      status: UserSeriesStatus.InProgress,
    })

    await render(
      <SeriesStatusSelect
        series={makeFragmentData(
          series,
          SeriesStatusSelect_SeriesFragmentFragmentDoc,
        )}
      />,
    )

    screen.getByText('In progress')
  })

  it('allows changing the status of the given series', async () => {
    const series = seriesFactory.build({
      id: '1',
      status: UserSeriesStatus.InProgress,
    })

    const [doc, mockResolver] = createMockResolver(SeriesUpdateStatusDocument, {
      data: {
        seriesUpdateStatus: {
          ...series,
          status: UserSeriesStatus.Completed,
        },
      },
    })

    await render(
      <SeriesStatusSelect
        series={makeFragmentData(
          series,
          SeriesStatusSelect_SeriesFragmentFragmentDoc,
        )}
      />,
      {
        requestMocks: [[doc, mockResolver]],
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

    expect(mockResolver).toHaveBeenCalledWith({
      input: {
        seriesId: 1,
        status: UserSeriesStatus.Completed,
      },
    })
  })
})
