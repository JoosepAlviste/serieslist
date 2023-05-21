import { useLazyQuery } from '@apollo/client'
import * as Popover from '@radix-ui/react-popover'
import classNames from 'classnames'
import React, {
  type HTMLAttributes,
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  useMemo,
  useCallback,
} from 'react'
import Highlighter from 'react-highlight-words'

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

  const triggerSearch = useDebouncedCallback(
    useCallback(
      async (keyword: string) => {
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
      },
      [seriesSearch],
    ),
    250,
  )

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

  const searchResults = useMemo(
    () => data?.seriesSearch ?? previousData?.seriesSearch ?? [],
    [data?.seriesSearch, previousData?.seriesSearch],
  )

  const searchResultItemsRef = useRef<HTMLAnchorElement[]>([])
  useEffect(() => {
    searchResultItemsRef.current = searchResultItemsRef.current.slice(
      0,
      searchResults.length,
    )
  }, [searchResults])

  const [activeIndex, setActiveIndex] = useState(0)

  const handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    let newIndex = activeIndex

    switch (e.key) {
      case 'Down':
      case 'ArrowDown':
        newIndex = Math.min(newIndex + 1, searchResults.length - 1)
        e.preventDefault()
        break
      case 'Up':
      case 'ArrowUp':
        newIndex = Math.max(newIndex - 1, 0)
        e.preventDefault()
        break
      case 'Enter':
        searchResultItemsRef.current[activeIndex]?.dispatchEvent(
          new MouseEvent('click', {
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
          }),
        )
        return
    }

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex)
      searchResultItemsRef.current[newIndex].scrollIntoView({
        behavior: 'smooth',
      })
    }
  }

  /**
   * Focus search input when `/` is typed.
   */
  const handlePageKeyUp = (e: Event) => {
    if (
      !(e instanceof KeyboardEvent) ||
      (e.target as HTMLInputElement).nodeName === 'INPUT'
    ) {
      return
    }

    if (e.key === '/') {
      inputRef.current?.focus()
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handlePageKeyUp)

    return () => {
      document.removeEventListener('keydown', handlePageKeyUp)
    }
  }, [])

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
            onKeyDown={handleInputKeyUp}
            onFocus={() => {
              setIsPopoverOpen(true)
            }}
          />
          {loading ? (
            <div className={s.inputAddonContainer}>
              <LoadingSpinner />
            </div>
          ) : keyword.length ? (
            <div className={s.inputAddonContainer}>
              <button type="button" onClick={clearKeyword}>
                <Icon name="cross" label="Clear" className={s.clearIcon} />
              </button>
            </div>
          ) : (
            <div
              className={classNames(s.inputAddonContainer, s.searchShortcut)}
            >
              /
            </div>
          )}
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
                    {searchResults.map((series, index) => (
                      <li
                        key={series.id}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <a
                          href={`https://imdb.com/title/${series.imdbId}`}
                          className={classNames(s.searchResult, {
                            [s.searchResultActive]: activeIndex === index,
                          })}
                          ref={(el) => {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            searchResultItemsRef.current[index] = el!
                          }}
                        >
                          <SeriesPoster series={series} />
                          <div>
                            <div className={s.searchResultTitle}>
                              <Highlighter
                                highlightClassName={s.titleHighlight}
                                searchWords={keyword.split(' ')}
                                autoEscape={true}
                                textToHighlight={series.title}
                              />
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