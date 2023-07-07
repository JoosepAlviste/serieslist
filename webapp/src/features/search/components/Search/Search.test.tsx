import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { seriesFactory } from '#/features/series'
import { SearchDocument, type Series } from '#/generated/gql/graphql'
import { createMockResolver, render, textContentMatcher } from '#/lib/testUtils'
import { wait } from '#/utils/misc'

import { Search } from './Search'

describe('features/search/components/Search', () => {
  const renderSearch = async (series: Series[] = []) => {
    const [doc, mockResolver] = createMockResolver(SearchDocument, {
      data: {
        seriesSearch: series,
      },
    })

    const result = await render(<Search />, {
      requestMocks: [[doc, mockResolver]],
    })

    return {
      ...result,
      mockResolver,
    }
  }

  it('triggers a search query when the user types something', async () => {
    const { mockResolver } = await renderSearch([
      seriesFactory.build({
        title: 'Cool Series',
      }),
      seriesFactory.build({
        title: 'Cool Beans',
      }),
    ])

    await userEvent.type(screen.getByPlaceholderText('Search...'), 'cool')

    // The search query has been made
    await waitFor(() =>
      expect(mockResolver).toHaveBeenCalledWith({
        input: {
          keyword: 'cool',
        },
      }),
    )

    // And the result is rendered
    screen.getByText(textContentMatcher('Cool Series'))
    screen.getByText(textContentMatcher('Cool Beans'))
  })

  it('allows clearing the input', async () => {
    await renderSearch()

    const input = screen.getByPlaceholderText('Search...')

    await userEvent.type(input, 'co')
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Clear',
      }),
    )

    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
  })

  it('does not trigger searching if less than 3 characters have been typed', async () => {
    const { mockResolver } = await renderSearch()

    await userEvent.type(screen.getByPlaceholderText('Search...'), 'co')

    await wait()

    // An encouraging message is shown
    screen.getByText('Keep typing...')

    // And the search query has not been made
    expect(mockResolver).not.toHaveBeenCalledWith({
      input: {
        keyword: 'cool',
      },
    })
  })

  it('shows the previous results until the new ones are loaded', async () => {
    const { mockResolver } = await renderSearch([
      seriesFactory.build({
        title: 'Previous Series',
      }),
    ])

    const input = screen.getByPlaceholderText('Search...')

    await userEvent.type(input, 'pre')

    // The results are shown
    await screen.findByText(textContentMatcher('Previous Series'))

    // The next search request returns different series
    mockResolver.mockResolvedValue({
      data: {
        seriesSearch: [
          seriesFactory.build({
            title: 'Precise New Series',
          }),
        ],
      },
    })

    // The user continues typing
    await userEvent.type(input, 'precise')

    // The previous series are still shown, even though the keyword has changed
    await waitForElementToBeRemoved(screen.getByText('Previous Series'))

    // The new series are shown once they are ready
    screen.getByText(textContentMatcher('Precise New Series'))
  })
})
