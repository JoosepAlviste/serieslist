import { useLazyQuery } from '@apollo/client'
import * as Popover from '@radix-ui/react-popover'
import classNames from 'classnames'
import React, { type HTMLAttributes, useState, useRef, useEffect } from 'react'

import { Icon, LoadingSpinner } from '@/components'
import { SeriesPoster } from '@/features/series'
import { graphql } from '@/generated/gql'
import { useDebouncedCallback } from '@/hooks'

import * as s from './Search.css'

type SearchProps = HTMLAttributes<HTMLLabelElement>

/**
 * The OMDb API does not return any results if the keyword is less than 3 chars.
 */
const KEYWORD_MIN_LENGTH = 3

const Search_Query = graphql(`
  query search($input: SeriesSearchInput!) {
    seriesSearch(input: $input) {
      id
      imdbId
      title
      startYear
      endYear
      ...SeriesPoster_SeriesFragment
    }
  }
`)

export const Search = ({ className, ...rest }: SearchProps) => {
  const [seriesSearch, { loading, data, previousData }] =
    useLazyQuery(Search_Query)

  const [keyword, setKeyword] = useState('')
  const [
    hasTriedToFetchWithTooShortKeyword,
    setHasTriedToFetchWithTooShortKeyword,
  ] = useState(true)

  useEffect(() => {
    if (keyword.length >= KEYWORD_MIN_LENGTH) {
      setHasTriedToFetchWithTooShortKeyword(false)
    }
  }, [keyword])

  const triggerSearch = useDebouncedCallback(async (keyword: string) => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword.length) {
      return
    }

    if (trimmedKeyword.length < KEYWORD_MIN_LENGTH) {
      setHasTriedToFetchWithTooShortKeyword(true)
      return
    }

    await seriesSearch({
      variables: {
        input: {
          keyword: trimmedKeyword,
        },
      },
    })
  }, 250)

  const clearKeyword = () => {
    setKeyword('')
    inputRef.current?.focus()
  }

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const inputContainerRef = useRef<HTMLLabelElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    triggerSearch(keyword)
  }, [keyword, triggerSearch])

  const searchResults = data?.seriesSearch ?? previousData?.seriesSearch ?? []

  return (
    <Popover.Root
      open={Boolean(isPopoverOpen && keyword)}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setIsPopoverOpen(true)
        }
      }}
    >
      <Popover.Trigger asChild>
        <label
          ref={inputContainerRef}
          className={classNames(s.container, className)}
          {...rest}
        >
          <Icon name="search" aria-hidden className={s.searchIcon} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search..."
            className={s.input}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
            }}
          />
          {loading ? (
            <LoadingSpinner />
          ) : keyword.length ? (
            <button type="button" onClick={clearKeyword}>
              <Icon name="cross" label="Clear" className={s.clearIcon} />
            </button>
          ) : null}
        </label>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={s.popoverContent}
          sideOffset={2}
          onOpenAutoFocus={(e) => {
            // Do not autofocus popover when it opens as otherwise the user
            // can't keep typing their search keyword
            e.preventDefault()
          }}
          onInteractOutside={(e) => {
            const wasClickedOnInput = inputContainerRef.current?.contains(
              e.target as HTMLElement,
            )

            if (!wasClickedOnInput) {
              setIsPopoverOpen(false)
            }
          }}
        >
          {(() => {
            if (
              keyword.length < KEYWORD_MIN_LENGTH &&
              hasTriedToFetchWithTooShortKeyword
            ) {
              return <div className={s.emptyState}>Keep typing...</div>
            } else if (searchResults.length) {
              return (
                <>
                  <div className={s.searchTitle}>Series</div>
                  <ul className={s.searchResultsList}>
                    {searchResults.map((series) => (
                      <li key={series.id}>
                        <a
                          href={`https://imdb.com/title/${series.imdbId}`}
                          className={s.searchResult}
                        >
                          <SeriesPoster series={series} />
                          <div>
                            <div className={s.searchResultTitle}>
                              {series.title}
                            </div>
                            <div className={s.searchResultDetails}>
                              {series.startYear} – {series.endYear ?? '...'}
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )
            } else {
              return <div className={s.emptyState}>No results :(</div>
            }
          })()}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
