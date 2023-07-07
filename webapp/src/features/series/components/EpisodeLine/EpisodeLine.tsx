import { useMutation } from '@apollo/client'
import { format } from 'date-fns'
import React from 'react'

import { Button } from '@/components'
import { useAuthenticatedUser } from '@/features/auth'
import { type FragmentType, graphql, useFragment } from '@/generated/gql'
import { useToast } from '@/hooks'

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

  const releasedAt = episode.releasedAt
    ? new Date(episode.releasedAt)
    : undefined

  return (
    <li className={s.episode}>
      <div className={s.episodeNumber}>
        {formatEpisodeNumber(season.number, episode.number)}
      </div>
      <div className={s.episodeTitle}>
        {episode.title}
        <span className={s.date}>
          {releasedAt ? ` · ${format(releasedAt, 'd MMM yyyy')}` : ''}
        </span>
      </div>
      {currentUser && (
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
