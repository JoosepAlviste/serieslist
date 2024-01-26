import * as Tabs from '@radix-ui/react-tabs'
import React, { useEffect, useState } from 'react'
import { navigate } from 'vike/client/router'

import { UserSeriesStatusStatus } from '#/generated/gql/graphql'

import { SeriesList } from '../SeriesList'

import * as s from './UserSeriesListPage.css'

type UserSeriesListPageProps = {
  status?: UserSeriesStatusStatus
}

const tabs = {
  all: 'All',
  [UserSeriesStatusStatus.InProgress]: 'In progress',
  [UserSeriesStatusStatus.PlanToWatch]: 'Plan to watch',
  [UserSeriesStatusStatus.OnHold]: 'On hold',
  [UserSeriesStatusStatus.Completed]: 'Completed',
}

const statusSlugs = {
  [UserSeriesStatusStatus.InProgress]: 'in-progress',
  [UserSeriesStatusStatus.PlanToWatch]: 'plan-to-watch',
  [UserSeriesStatusStatus.OnHold]: 'on-hold',
  [UserSeriesStatusStatus.Completed]: 'completed',
}

export const UserSeriesListPage = ({ status }: UserSeriesListPageProps) => {
  const [selectedStatus, setSelectedStatus] = useState(status)

  useEffect(() => {
    const redirect = async () => {
      if (selectedStatus) {
        const statusSlug = statusSlugs[selectedStatus]
        await navigate(`/series/list/${statusSlug}`)
      } else {
        await navigate('/series/list/all')
      }
    }

    redirect().catch(console.error)
  }, [selectedStatus])

  useEffect(() => {
    setSelectedStatus(status)
  }, [status])

  return (
    <Tabs.Root
      value={selectedStatus ?? 'all'}
      onValueChange={(newTab) => {
        setSelectedStatus(
          newTab === 'all' ? undefined : (newTab as UserSeriesStatusStatus),
        )
      }}
      className={s.container}
    >
      <Tabs.List className={s.tabs}>
        {Object.entries(tabs).map(([tabValue, label]) => (
          <Tabs.Trigger key={tabValue} value={tabValue} className={s.tab}>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <SeriesList status={selectedStatus} />
    </Tabs.Root>
  )
}
