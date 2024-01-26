import React from 'react'

import { UserSeriesStatusStatus } from '#/generated/gql/graphql'
import { usePageContext } from '#/hooks'

import { UserSeriesListPage } from '../../components/UserSeriesListPage'

const statuses: Record<string, UserSeriesStatusStatus> = {
  ['in-progress']: UserSeriesStatusStatus.InProgress,
  ['on-hold']: UserSeriesStatusStatus.OnHold,
  ['completed']: UserSeriesStatusStatus.Completed,
  ['plan-to-watch']: UserSeriesStatusStatus.PlanToWatch,
}

export const Page = () => {
  const ctx = usePageContext()

  const status = ctx.routeParams?.status
    ? statuses[ctx.routeParams.status]
    : undefined

  return <UserSeriesListPage status={status} />
}
