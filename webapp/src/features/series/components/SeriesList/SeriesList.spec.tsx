import { screen } from '@testing-library/react'
import React from 'react'

import { SeriesListDocument, UserSeriesStatus } from '@/generated/gql/graphql'
import { createMockResolver, render } from '@/lib/testUtils'

import { seriesFactory } from '../../series.factory'

import { SeriesList } from './SeriesList'

describe('features/series/components/SeriesList', () => {
  it("fetches and renders the user's series", async () => {
    const [doc, mockResolver] = createMockResolver(SeriesListDocument, {
      data: {
        userSeriesList: {
          __typename: 'QueryUserSeriesListSuccess',
          data: [
            seriesFactory.build({ title: 'Test Series 1' }),
            seriesFactory.build({ title: 'Test Series 2' }),
          ],
        },
      },
    })

    await render(<SeriesList status={UserSeriesStatus.Completed} />, {
      requestMocks: [[doc, mockResolver]],
    })

    expect(mockResolver).toHaveBeenCalledWith({
      input: {
        status: UserSeriesStatus.Completed,
      },
    })

    screen.getByText('Test Series 1')
    screen.getByText('Test Series 2')
  })
})
