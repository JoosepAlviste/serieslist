import { useMutation } from '@apollo/client'
import React from 'react'

import { IconButton, Tooltip } from '@/components'
import { type FragmentType, graphql, useFragment } from '@/generated/gql'

import { formatEpisodeNumber } from '../../utils/formatEpisodeNumber'

import * as s from './LatestSeenEpisodeCell.css'

const LatestSeenEpisodeCell_SeriesFragment = graphql(`
  fragment LatestSeenEpisodeCell_SeriesFragment on Series {
    latestSeenEpisode {
      id
      number
      season {
        id
        number
      }
    }
    nextEpisode {
      id
    }
  }
`)

type LatestSeenEpisodeCellProps = {
  series: FragmentType<typeof LatestSeenEpisodeCell_SeriesFragment>
}

export const LatestSeenEpisodeCell = ({
  series: seriesOriginal,
}: LatestSeenEpisodeCellProps) => {
  const series = useFragment(
    LatestSeenEpisodeCell_SeriesFragment,
    seriesOriginal,
  )

  const [toggleEpisodeSeenMutate] = useMutation(
    graphql(`
      mutation LatestSeenEpisodeToggleEpisodeSeen(
        $input: ToggleEpisodeSeenInput!
      ) {
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

  const handleIncrementSeenEpisodeClick = async (nextEpisodeId: string) => {
    await toggleEpisodeSeenMutate({
      variables: {
        input: {
          episodeId: parseInt(nextEpisodeId),
        },
      },
    })
  }

  return (
    <div className={s.container}>
      {series.latestSeenEpisode
        ? formatEpisodeNumber(
            series.latestSeenEpisode.season.number,
            series.latestSeenEpisode.number,
          )
        : '-'}
      {series.nextEpisode ? (
        <Tooltip text="Mark next episode as seen" side="top">
          <IconButton
            name="plus"
            variant="primary"
            label="Mark next episode as seen"
            onClick={async () => {
              if (!series.nextEpisode) {
                return
              }

              await handleIncrementSeenEpisodeClick(series.nextEpisode.id)
            }}
          />
        </Tooltip>
      ) : null}
    </div>
  )
}
