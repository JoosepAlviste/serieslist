import { useMutation } from '@apollo/client'
import { Button, Text } from '@serieslist/core-ui'
import { isFuture } from 'date-fns'
import React from 'react'

import { useAuthenticatedUser } from '#/features/auth'
import { type FragmentType, graphql, useFragment } from '#/generated/gql'
import { useToast } from '#/hooks'
import { formatDate } from '#/utils/dates'

import { formatEpisodeNumber } from '../../utils/formatEpisodeNumber'

import * as s from './EpisodeLine.css'

const EpisodeLine_EpisodeFragment = graphql(`
  fragment EpisodeLine_EpisodeFragment on Episode {
    id
    number
    title
    isSeen
    releasedAt
  }
`)

const EpisodeLine_SeasonFragment = graphql(`
  fragment EpisodeLine_SeasonFragment on Season {
    number
  }
`)

type EpisodeLineProps = {
  episode: FragmentType<typeof EpisodeLine_EpisodeFragment>
  season: FragmentType<typeof EpisodeLine_SeasonFragment>
}

export const EpisodeLine = ({
  episode: episodeOriginal,
  season: seasonOriginal,
}: EpisodeLineProps) => {
  const episode = useFragment(EpisodeLine_EpisodeFragment, episodeOriginal)
  const season = useFragment(EpisodeLine_SeasonFragment, seasonOriginal)

  const { currentUser } = useAuthenticatedUser()
  const { showToast, showErrorToast } = useToast()

  const [toggleEpisodeSeen] = useMutation(
    graphql(`
      mutation toggleEpisodeSeen($input: ToggleEpisodeSeenInput!) {
        toggleEpisodeSeen(input: $input) {
          __typename
          ... on Error {
            message
          }
          ... on Episode {
            id
            isSeen
            season {
              id
              series {
                id
                ...LatestSeenEpisodeCell_SeriesFragment
              }
            }
          }
        }
      }
    `),
  )

  const handleToggleEpisodeSeenClick = async () => {
    const res = await toggleEpisodeSeen({
      variables: {
        input: {
          episodeId: parseInt(episode.id),
        },
      },
    })

    if (res.data?.toggleEpisodeSeen.__typename === 'Episode') {
      const { isSeen } = res.data.toggleEpisodeSeen

      showToast({
        id: 'mark_episode_as_seen',
        title: isSeen ? 'Episode marked as seen' : 'Episode marked as not seen',
      })
    } else {
      showErrorToast()
    }
  }

  const isAiringInTheFuture = episode.releasedAt
    ? isFuture(new Date(episode.releasedAt))
    : false

  return (
    <li className={s.episode}>
      <Text variant="secondary" weight="bold">
        {formatEpisodeNumber(season.number, episode.number)}
      </Text>
      <Text variant="secondary" className={s.episodeTitle}>
        {episode.title}
        <Text as="span" size="s" variant="tertiary">
          {episode.releasedAt ? ` · ${formatDate(episode.releasedAt)}` : ''}
        </Text>
      </Text>
      {currentUser && !isAiringInTheFuture && (
        <Button
          variant={episode.isSeen ? 'primary' : 'secondary'}
          size="s"
          onClick={handleToggleEpisodeSeenClick}
        >
          {episode.isSeen ? 'Seen' : 'Mark as seen'}
        </Button>
      )}
    </li>
  )
}
