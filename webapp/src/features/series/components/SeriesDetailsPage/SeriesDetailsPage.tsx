import { useMutation, useQuery } from '@apollo/client'
import * as Tabs from '@radix-ui/react-tabs'
import React from 'react'

import { Select } from '@/components'
import { useAuthenticatedUser } from '@/features/auth'
import { graphql } from '@/generated/gql'
import { UserSeriesStatus } from '@/generated/gql/graphql'

import { formatEpisodeNumber } from '../../utils/formatEpisodeNumber'
import { SeriesPoster } from '../SeriesPoster'

import { ReactComponent as ImdbLogo } from './ImdbLogo.svg'
import * as s from './SeriesDetailsPage.css'

type SeriesDetailsPageProps = {
  seriesId: string
}

const STATUS_LABELS = {
  [UserSeriesStatus.InProgress]: 'In progress',
  [UserSeriesStatus.Completed]: 'Completed',
  [UserSeriesStatus.PlanToWatch]: 'Plan to watch',
  [UserSeriesStatus.OnHold]: 'On hold',
  default: 'No status',
} as const

export const SeriesDetailsPage = ({ seriesId }: SeriesDetailsPageProps) => {
  const { currentUser } = useAuthenticatedUser()

  const { data, loading } = useQuery(
    graphql(`
      query seriesDetailsPage($id: ID!) {
        series(id: $id) {
          __typename
          ... on NotFoundError {
            message
          }
          ... on Series {
            id
            imdbId
            title
            startYear
            endYear
            plot
            status
            ...SeriesPoster_SeriesFragment
            seasons {
              id
              number
              episodes {
                id
                imdbId
                number
                title
                releasedAt
                imdbRating
              }
            }
          }
        }
      }
    `),
    {
      variables: {
        id: seriesId,
      },
    },
  )

  const series = data?.series.__typename === 'Series' ? data.series : null

  const [updateStatusMutate] = useMutation(
    graphql(`
      mutation seriesUpdateStatus($input: SeriesUpdateStatusInput!) {
        seriesUpdateStatus(input: $input) {
          __typename
          ... on Series {
            id
            status
          }
        }
      }
    `),
  )

  const handleUpdateStatus = async (status: keyof typeof STATUS_LABELS) => {
    if (!series) {
      return
    }

    await updateStatusMutate({
      variables: {
        input: {
          status: status !== 'default' ? status : null,
          seriesId: parseInt(series.id),
        },
      },
    })

    // TODO: Show notification that it was successful
  }

  return (
    <div>
      {loading && <div>Loading...</div>}

      {series && (
        <div className={s.container}>
          <SeriesPoster series={series} size="l" className={s.poster} />
          <div>
            <div className={s.titleLine}>
              <div className={s.titleContainer}>
                <h1 className={s.title}>{series.title}</h1>
                <a
                  href={`https://imdb.com/title/${series.imdbId}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="IMDb page"
                >
                  <ImdbLogo className={s.imdbLogo} />
                </a>
              </div>

              {currentUser && (
                <Select
                  options={Object.entries(STATUS_LABELS).map(
                    ([value, label]) => ({
                      label,
                      value,
                    }),
                  )}
                  value={series.status ?? 'default'}
                  onChange={handleUpdateStatus}
                />
              )}
            </div>
            <div className={s.years}>
              {series.startYear} – {series.endYear ?? '…'}
            </div>
            <div className={s.description}>{series.plot}</div>

            <Tabs.Root
              defaultValue={series.seasons[0]?.id}
              className={s.seasons}
            >
              <h2 className={s.seasonsTitle}>Seasons</h2>

              <div className={s.seasonTabsContainer}>
                <Tabs.List className={s.seasonTabs}>
                  {series.seasons.map((season) => (
                    <Tabs.Trigger
                      key={season.id}
                      value={season.id}
                      className={s.seasonTrigger}
                    >
                      {season.number}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
              </div>

              {series.seasons.map((season) => (
                <Tabs.Content key={season.id} value={season.id}>
                  <h3 className={s.episodesTitle}>Season {season.number}</h3>

                  <ol className={s.episodesContainer}>
                    {season.episodes.map((episode) => (
                      <li key={episode.id} className={s.episode}>
                        <div className={s.episodeNumber}>
                          {formatEpisodeNumber(season.number, episode.number)}
                        </div>
                        {episode.title}
                      </li>
                    ))}
                  </ol>
                </Tabs.Content>
              ))}
            </Tabs.Root>
          </div>
        </div>
      )}
    </div>
  )
}
