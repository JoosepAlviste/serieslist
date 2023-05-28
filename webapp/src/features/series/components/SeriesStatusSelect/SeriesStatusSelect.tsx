import { useMutation } from '@apollo/client'
import React from 'react'

import { Select } from '@/components'
import { type FragmentType, graphql, useFragment } from '@/generated/gql'
import { UserSeriesStatus } from '@/generated/gql/graphql'
import { useToast } from '@/hooks'

const STATUS_LABELS = {
  [UserSeriesStatus.InProgress]: 'In progress',
  [UserSeriesStatus.Completed]: 'Completed',
  [UserSeriesStatus.PlanToWatch]: 'Plan to watch',
  [UserSeriesStatus.OnHold]: 'On hold',
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
  )

  const { showToast } = useToast()

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
    }
  }

  return (
    <Select
      options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
        label,
        value,
      }))}
      value={series.status ?? 'default'}
      onChange={handleUpdateStatus}
      label="Change status"
    />
  )
}
