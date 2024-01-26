import { useMutation } from '@apollo/client'
import { Button, Select, AlertDialog } from '@serieslist/ui'
import React, { useState } from 'react'

import { type FragmentType, graphql, useFragment } from '#/generated/gql'
import { UserSeriesStatusStatus } from '#/generated/gql/graphql'
import { useToast } from '#/hooks'
import { invalidateCacheFields } from '#/lib/apollo'

const STATUS_LABELS = {
  [UserSeriesStatusStatus.InProgress]: 'In progress',
  [UserSeriesStatusStatus.Completed]: 'Completed',
  [UserSeriesStatusStatus.PlanToWatch]: 'Plan to watch',
  [UserSeriesStatusStatus.OnHold]: 'On hold',
  default: 'No status',
} as const

const SeriesStatusSelect_SeriesFragment = graphql(`
  fragment SeriesStatusSelect_SeriesFragment on Series {
    id
    status
  }
`)

type SeriesStatusSelectProps = {
  series: FragmentType<typeof SeriesStatusSelect_SeriesFragment>
}

export const SeriesStatusSelect = ({
  series: seriesProp,
}: SeriesStatusSelectProps) => {
  const series = useFragment(SeriesStatusSelect_SeriesFragment, seriesProp)

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
    {
      update: invalidateCacheFields(['userSeriesList']),
    },
  )

  const [markSeriesEpisodesAsSeenMutate] = useMutation(
    graphql(`
      mutation markSeriesEpisodesAsSeen(
        $input: MarkSeriesEpisodesAsSeenInput!
      ) {
        markSeriesEpisodesAsSeen(input: $input) {
          __typename
          ... on Error {
            message
          }
          ... on Series {
            id
            ...LatestSeenEpisodeCell_SeriesFragment
            seasons {
              id
              episodes {
                id
                isSeen
              }
            }
          }
        }
      }
    `),
  )

  const { showToast } = useToast()

  const [
    isMarkAllEpisodesAsSeenAlertOpen,
    setIsMarkAllEpisodesAsSeenAlertOpen,
  ] = useState(false)

  const handleUpdateStatus = async (status: keyof typeof STATUS_LABELS) => {
    const { data } = await updateStatusMutate({
      variables: {
        input: {
          status: status !== 'default' ? status : null,
          seriesId: parseInt(series.id),
        },
      },
    })

    if (data?.seriesUpdateStatus.__typename === 'Series') {
      showToast({
        id: 'status_change',
        title: 'Series status changed',
      })

      if (status === UserSeriesStatusStatus.Completed) {
        setIsMarkAllEpisodesAsSeenAlertOpen(true)
      }
    }
  }

  const handleMarkAllEpisodesAsSeen = async () => {
    const res = await markSeriesEpisodesAsSeenMutate({
      variables: {
        input: {
          seriesId: series.id,
        },
      },
    })

    if (res.data?.markSeriesEpisodesAsSeen.__typename === 'Series') {
      showToast({
        id: 'series_episodes_marked_as_seen',
        title: 'All episodes marked as seen',
      })
    }
  }

  return (
    <AlertDialog.Dialog
      title="Mark all episodes as seen?"
      description="Would you like to mark all episodes of the series as seen?"
      isOpen={isMarkAllEpisodesAsSeenAlertOpen}
      onOpenChange={(isOpen) => setIsMarkAllEpisodesAsSeenAlertOpen(isOpen)}
      actions={
        <>
          <AlertDialog.Cancel asChild>
            <Button variant="secondary">No</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action
            asChild
            onClick={async () => {
              await handleMarkAllEpisodesAsSeen()
            }}
          >
            <Button variant="primary">Yes, mark all as seen</Button>
          </AlertDialog.Action>
        </>
      }
    >
      <Select
        options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
          label,
          value,
        }))}
        value={series.status ?? 'default'}
        onChange={handleUpdateStatus}
        label="Change status"
      />
    </AlertDialog.Dialog>
  )
}
