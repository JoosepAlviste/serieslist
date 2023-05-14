import classNames from 'classnames'
import React, { type ComponentPropsWithoutRef } from 'react'

import { type FragmentType, graphql, useFragment } from '@/generated/gql'

import * as s from './SeriesPoster.css'
import posterPlaceholder from './seriesPosterPlaceholder.svg'

const SeriesPoster_SeriesFragment = graphql(`
  fragment SeriesPoster_SeriesFragment on Series {
    poster
  }
`)

type SeriesPosterProps = ComponentPropsWithoutRef<'div'> & {
  series: FragmentType<typeof SeriesPoster_SeriesFragment>
}

export const SeriesPoster = ({
  series: seriesOriginal,
  className,
  ...rest
}: SeriesPosterProps) => {
  const series = useFragment(SeriesPoster_SeriesFragment, seriesOriginal)

  return (
    <div className={classNames(s.posterContainer, className)} {...rest}>
      <img src={series.poster ?? posterPlaceholder} className={s.poster} />
    </div>
  )
}
