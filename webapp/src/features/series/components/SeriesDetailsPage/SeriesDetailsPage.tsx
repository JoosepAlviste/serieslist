import { useQuery } from '@apollo/client'
import * as Tabs from '@radix-ui/react-tabs'
import React from 'react'

import { graphql } from '@/generated/gql'

import { formatEpisodeNumber } from '../../utils/formatEpisodeNumber'
import { SeriesPoster } from '../SeriesPoster'

import { ReactComponent as ImdbLogo } from './ImdbLogo.svg'
import * as s from './SeriesDetailsPage.css'

type SeriesDetailsPageProps = {
  seriesId: string
}

export const SeriesDetailsPage = ({ seriesId }: SeriesDetailsPageProps) => {
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

  return (
    <div>
      {loading && <div>Loading...</div>}

      {series && (
        <div className={s.container}>
          <SeriesPoster series={series} size="l" className={s.poster} />
          <div>
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
