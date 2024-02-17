import React from 'react'

import { usePageContext } from '#/hooks'

import { SeriesDetailsPage } from '../../components/SeriesDetailsPage'

export const Page = () => {
  const ctx = usePageContext()

  // TODO: Can we somehow statically set this type?
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return <SeriesDetailsPage seriesId={ctx.routeParams!.id} />
}
