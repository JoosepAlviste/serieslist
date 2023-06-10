import * as Tabs from '@radix-ui/react-tabs'
import React, { useEffect, useState } from 'react'

import { UserSeriesStatus } from '@/generated/gql/graphql'

import { SeriesList } from '../SeriesList'

import * as s from './UserSeriesListPage.css'

type UserSeriesListPageProps = {
  status?: UserSeriesStatus
}

const tabs = {
  all: 'All',
  [UserSeriesStatus.InProgress]: 'In progress',
  [UserSeriesStatus.PlanToWatch]: 'Plan to watch',
  [UserSeriesStatus.OnHold]: 'On hold',
  [UserSeriesStatus.Completed]: 'Completed',
}

const statusSlugs = {
  [UserSeriesStatus.InProgress]: 'in-progress',
  [UserSeriesStatus.PlanToWatch]: 'plan-to-watch',
  [UserSeriesStatus.OnHold]: 'on-hold',
  [UserSeriesStatus.Completed]: 'completed',
}

export const UserSeriesListPage = ({ status }: UserSeriesListPageProps) => {
  const [selectedStatus, setSelectedStatus] = useState(status)

  useEffect(() => {
    if (selectedStatus) {
      const statusSlug = statusSlugs[selectedStatus]
      window.history.pushState({}, '', `/series/list/${statusSlug}`)
    } else {
      window.history.pushState({}, '', '/series/list/all')
    }
  }, [selectedStatus])

  return (
    <Tabs.Root
      value={selectedStatus ?? 'all'}
      onValueChange={(newTab) =>
        setSelectedStatus(
          newTab === 'all' ? undefined : (newTab as UserSeriesStatus),
        )
      }
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