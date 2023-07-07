import { useMutation, useQuery } from '@apollo/client'
import * as Tabs from '@radix-ui/react-tabs'
import { isAfter } from 'date-fns'
import React from 'react'

import { Button, Tooltip } from '#/components'
import { useAuthenticatedUser } from '#/features/auth'
import { graphql } from '#/generated/gql'
import { useToast } from '#/hooks'
import { formatDate } from '#/utils/formatDate'

import { EpisodeLine } from '../EpisodeLine'
import { SeriesPoster } from '../SeriesPoster'
import { SeriesStatusSelect } from '../SeriesStatusSelect'

import { ReactComponent as ImdbLogo } from './ImdbLogo.svg'
import * as s from './SeriesDetailsPage.css'

type SeriesDetailsPageProps = {
  seriesId: string
}

export const SeriesDetailsPage = ({ seriesId }: SeriesDetailsPageProps) => {
  const { showToast, showErrorToast } = useToast()
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
            ...SeriesPoster_SeriesFragment
            ...SeriesStatusSelect_SeriesFragment
            seasons {
              id
              number
              title
              episodes {
                id
                isSeen
                releasedAt
                ...EpisodeLine_EpisodeFragment
              }
              ...EpisodeLine_SeasonFragment
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

  const [markSeasonEpisodesAsSeenMutate] = useMutation(
    graphql(`
      mutation markSeasonEpisodesAsSeen(
        $input: MarkSeasonEpisodesAsSeenInput!
      ) {
        markSeasonEpisodesAsSeen(input: $input) {
          __typename
          ... on Error {
            message
          }
          ... on Season {
            id
            episodes {
              id
              isSeen
            }
            series {
              id
              ...LatestSeenEpisodeCell_SeriesFragment
            }
          }
        }
      }
    `),
  )

  const handleMarkSeasonAsSeenClicked = async (seasonId: string) => {
    const res = await markSeasonEpisodesAsSeenMutate({
      variables: {
        input: {
          seasonId: parseInt(seasonId),
        },
      },
    })

    if (res.data?.markSeasonEpisodesAsSeen.__typename === 'Season') {
      showToast({
        id: 'mark_season_as_seen',
        title: 'Season marked as seen',
      })
    } else {
      showErrorToast()
    }
  }

  const firstNonZeroSeason = series?.seasons.find(
    (season) => season.number !== 0,
  )

  const nextEpisode = series?.seasons
    .map((season) => season.episodes)
    .flat()
    .find(
      (episode) =>
        !episode.releasedAt ||
        isAfter(new Date(episode.releasedAt), new Date(Date.now())),
    )

  return (
    <div>
      {loading && <div>Loading...</div>}

      {series && (
        <div className={s.container}>
          <SeriesPoster series={series} size="l" className={s.poster} />

          <div className={s.titleContainer}>
            <h1 className={s.title}>{series.title}</h1>
            {series.imdbId && (
              <a
                href={`https://imdb.com/title/${series.imdbId}`}
                target="_blank"
                rel="noreferrer"
                aria-label="IMDb page"
              >
                <ImdbLogo className={s.imdbLogo} />
              </a>
            )}
          </div>

          {currentUser && (
            <div className={s.statusSelectContainer}>
              <SeriesStatusSelect series={series} />
            </div>
          )}

          <div className={s.years}>
            <div>
              {series.startYear} – {series.endYear ?? '…'}
            </div>

            {nextEpisode?.releasedAt ? (
              <div className={s.nextEpisode}>
                <b className={s.nextEpisodeTitle}>Next episode</b>{' '}
                {formatDate(nextEpisode.releasedAt)}
              </div>
            ) : null}
          </div>
          <div className={s.descriptionContainer}>
            <div className={s.description}>{series.plot}</div>
          </div>

          <Tabs.Root
            defaultValue={firstNonZeroSeason?.id}
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

            {series.seasons.map((season) => {
              const areAllEpisodesSeen = season.episodes.every(
                (episode) => episode.isSeen,
              )

              return (
                <Tabs.Content key={season.id} value={season.id}>
                  <div className={s.episodesTitleRow}>
                    <h3 className={s.episodesTitle}>{season.title}</h3>

                    {currentUser && (
                      <Tooltip
                        text={
                          areAllEpisodesSeen
                            ? 'All episodes are already seen'
                            : undefined
                        }
                      >
                        <Button
                          onClick={() =>
                            handleMarkSeasonAsSeenClicked(season.id)
                          }
                          variant={areAllEpisodesSeen ? 'primary' : 'secondary'}
                          size="s"
                          isDisabled={areAllEpisodesSeen}
                        >
                          {areAllEpisodesSeen ? 'Seen' : 'Mark season as seen'}
                        </Button>
                      </Tooltip>
                    )}
                  </div>

                  <ol className={s.episodesContainer}>
                    {season.episodes.map((episode) => (
                      <EpisodeLine
                        key={episode.id}
                        episode={episode}
                        season={season}
                      />
                    ))}
                  </ol>
                </Tabs.Content>
              )
            })}
          </Tabs.Root>
        </div>
      )}
    </div>
  )
}
