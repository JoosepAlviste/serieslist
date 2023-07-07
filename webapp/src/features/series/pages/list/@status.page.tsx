import React from 'react'

import { UserSeriesStatus } from '#/generated/gql/graphql'
import { usePageContext } from '#/hooks'

import { UserSeriesListPage } from '../../components/UserSeriesListPage'

const statuses: Record<string, UserSeriesStatus> = {
  ['in-progress']: UserSeriesStatus.InProgress,
  ['on-hold']: UserSeriesStatus.OnHold,
  ['completed']: UserSeriesStatus.Completed,
  ['plan-to-watch']: UserSeriesStatus.PlanToWatch,
}

export const Page = () => {
  const ctx = usePageContext()

  const status = ctx.routeParams?.status
    ? statuses[ctx.routeParams.status]
    : undefined

  return <UserSeriesListPage status={status} />
}
